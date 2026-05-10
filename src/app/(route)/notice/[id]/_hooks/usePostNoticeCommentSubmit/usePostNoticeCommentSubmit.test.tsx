import { act, renderHook } from "@testing-library/react";
import type { UseFormReturn } from "react-hook-form";
import { usePostNoticeComment } from "@/api/fetch/noticeComment";
import { usePostNoticeCommentSubmit } from "./usePostNoticeCommentSubmit";

const readBlobAsText = async (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });

jest.mock("@/api/fetch/noticeComment", () => ({
  usePostNoticeComment: jest.fn(),
}));

describe("usePostNoticeCommentSubmit", () => {
  const mockMutate = jest.fn();
  const mockReset = jest.fn();
  const mockOpenGuestModal = jest.fn();

  const methods = { reset: mockReset } as unknown as UseFormReturn<{ content: string }>;

  const defaultProps = {
    noticeId: 10,
    methods,
    isLoggedIn: true,
    openGuestModal: mockOpenGuestModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate.mockImplementation((_formData: FormData, options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
    });
    (usePostNoticeComment as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("noticeId로 usePostNoticeComment를 사용합니다", () => {
    renderHook(() => usePostNoticeCommentSubmit({ ...defaultProps, noticeId: 55 }));
    expect(usePostNoticeComment).toHaveBeenCalledWith(55);
  });

  it("비로그인이면 게스트 모달만 열고 mutate 하지 않습니다", () => {
    const { result } = renderHook(() =>
      usePostNoticeCommentSubmit({ ...defaultProps, isLoggedIn: false })
    );

    act(() => {
      result.current.handleCommentSubmit({ content: "댓글" });
    });

    expect(mockOpenGuestModal).toHaveBeenCalledTimes(1);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("isPending이면 mutate 하지 않습니다", () => {
    (usePostNoticeComment as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));

    act(() => {
      result.current.handleCommentSubmit({ content: "내용" });
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("내용과 이미지가 모두 비어 있으면 mutate 하지 않습니다", () => {
    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));

    act(() => {
      result.current.handleCommentSubmit({ content: "   " });
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("trim한 본문과 parentId null을 담은 FormData로 mutate합니다", async () => {
    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));

    act(() => {
      result.current.handleCommentSubmit({ content: "  본문입니다  " });
    });

    expect(mockMutate).toHaveBeenCalledTimes(1);
    const [formData] = mockMutate.mock.calls[0] as [FormData];
    expect(formData).toBeInstanceOf(FormData);

    const blob = formData.get("request") as Blob;
    expect(JSON.parse(await readBlobAsText(blob))).toEqual({
      content: "본문입니다",
      parentId: null,
    });
    expect(formData.getAll("images")).toHaveLength(0);
  });

  it("첨부 이미지를 FormData images에 넣습니다", async () => {
    const f1 = new File(["a"], "1.png", { type: "image/png" });
    const f2 = new File(["b"], "2.png", { type: "image/png" });

    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));

    act(() => {
      result.current.setImages([f1, f2]);
    });

    act(() => {
      result.current.handleCommentSubmit({ content: "글" });
    });

    const [formData] = mockMutate.mock.calls[0] as [FormData];
    expect(formData.getAll("images")).toEqual([f1, f2]);
  });

  it("내용 없이 이미지만 있어도 mutate 합니다", async () => {
    const file = new File(["x"], "only.png", { type: "image/png" });
    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));

    act(() => {
      result.current.setImages([file]);
    });

    act(() => {
      result.current.handleCommentSubmit({ content: "" });
    });

    expect(mockMutate).toHaveBeenCalledTimes(1);
    const [formData] = mockMutate.mock.calls[0] as [FormData];
    const blob = formData.get("request") as Blob;
    expect(JSON.parse(await readBlobAsText(blob))).toEqual({
      content: "",
      parentId: null,
    });
    expect(formData.get("images")).toBe(file);
  });

  it("mutate onSuccess 시 폼을 비우고 이미지 상태를 초기화합니다", () => {
    const file = new File(["z"], "z.png", { type: "image/png" });
    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));

    act(() => {
      result.current.setImages([file]);
    });

    act(() => {
      result.current.handleCommentSubmit({ content: "ok" });
    });

    expect(mockReset).toHaveBeenCalledWith({ content: "" });
    expect(result.current.images).toEqual([]);
  });

  it("isPending을 그대로 노출합니다", () => {
    (usePostNoticeComment as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    const { result } = renderHook(() => usePostNoticeCommentSubmit(defaultProps));
    expect(result.current.isPending).toBe(true);
  });
});
