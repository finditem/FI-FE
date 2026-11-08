import { act, renderHook } from "@testing-library/react";
import { usePostNoticeComment } from "@/api/fetch/noticeComment";
import { useHandleNoticeReplySubmit } from "./useHandleNoticeReplySubmit";

const readBlobAsText = async (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });

const mockInvalidateQueries = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("@/api/fetch/noticeComment", () => ({
  usePostNoticeComment: jest.fn(),
}));

describe("useHandleNoticeReplySubmit", () => {
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutateAsync.mockImplementation(
      async (_formData: FormData, options?: { onSuccess?: () => void }) => {
        options?.onSuccess?.();
        return {};
      }
    );
    (usePostNoticeComment as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it("noticeId로 usePostNoticeComment를 구독합니다", () => {
    renderHook(() => useHandleNoticeReplySubmit(123));
    expect(usePostNoticeComment).toHaveBeenCalledWith(123);
  });

  it("공백만 있는 내용이면 mutateAsync를 호출하지 않습니다", async () => {
    const { result } = renderHook(() => useHandleNoticeReplySubmit(10));

    await act(async () => {
      await result.current.handleReplySubmit("   \n\t  ", null, 5);
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(mockInvalidateQueries).not.toHaveBeenCalled();
  });

  it("isPending이 true면 mutateAsync를 호출하지 않습니다", async () => {
    (usePostNoticeComment as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    const { result } = renderHook(() => useHandleNoticeReplySubmit(10));

    await act(async () => {
      await result.current.handleReplySubmit("내용", null, 5);
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it("trim한 본문과 parentId로 JSON Blob을 붙인 FormData로 mutateAsync를 호출합니다", async () => {
    const { result } = renderHook(() => useHandleNoticeReplySubmit(99));

    await act(async () => {
      await result.current.handleReplySubmit("  안녕하세요  ", null, 7);
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    const [formData] = mockMutateAsync.mock.calls[0] as [FormData];

    expect(formData).toBeInstanceOf(FormData);

    const requestPart = formData.get("request") as Blob;
    expect(requestPart).toBeTruthy();
    const json = JSON.parse(await readBlobAsText(requestPart));
    expect(json).toEqual({ content: "안녕하세요", parentId: 7 });
    expect(formData.get("images")).toBeNull();
  });

  it("이미지가 있으면 FormData에 images 필드를 추가합니다", async () => {
    const file = new File(["x"], "a.png", { type: "image/png" });
    const { result } = renderHook(() => useHandleNoticeReplySubmit(1));

    await act(async () => {
      await result.current.handleReplySubmit("글", file, 2);
    });

    const [formData] = mockMutateAsync.mock.calls[0] as [FormData];
    expect(formData.get("images")).toBe(file);
  });

  it("mutateAsync 성공 시 replies-notice-comments 쿼리를 무효화합니다", async () => {
    const { result } = renderHook(() => useHandleNoticeReplySubmit(5));

    await act(async () => {
      await result.current.handleReplySubmit("댓글", null, 42);
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["replies-notice-comments", 42],
    });
  });

  it("isPending을 그대로 노출합니다", () => {
    (usePostNoticeComment as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    const { result } = renderHook(() => useHandleNoticeReplySubmit(1));
    expect(result.current.isPending).toBe(true);
  });
});
