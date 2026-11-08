import { act, renderHook } from "@testing-library/react";
import useInquiryWrite from "./useInquiryWrite";
import { useGetUsersMe } from "@/api/fetch/user";
import { usePostInquiry } from "@/api/fetch/inquiry";
import { resizeImage } from "@/utils";

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: jest.fn(),
}));

jest.mock("@/api/fetch/inquiry", () => ({
  usePostInquiry: jest.fn(),
}));

jest.mock("@/utils", () => ({
  resizeImage: jest.fn(),
}));

const mockUseGetUsersMe = jest.mocked(useGetUsersMe);
const mockUsePostInquiry = jest.mocked(usePostInquiry);
const mockResizeImage = jest.mocked(resizeImage);

const stubFormPayload = {
  title: "제목",
  content: "내용",
  inquiryType: "ETC",
  email: "inquiry@test.com",
} as const;

const createFile = () => new File(["x"], "a.png", { type: "image/png" });

async function readFormDataBlobPartAsUtf8(blobLike: Blob): Promise<string> {
  if (typeof blobLike.text === "function") {
    return blobLike.text();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blobLike);
  });
}

describe("useInquiryWrite", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePostInquiry.mockImplementation(
      () =>
        ({
          mutate,
          isPending: false,
        }) as unknown as ReturnType<typeof usePostInquiry>
    );
  });

  it("로그인 성공 시 userEmail과 isUserSuccess가 반영되고 문의 게시 함수에 같은 성공 여부가 전달된다", () => {
    mockUseGetUsersMe.mockReturnValue({
      data: { result: { email: "me@test.com" } },
      isSuccess: true,
    } as unknown as ReturnType<typeof useGetUsersMe>);

    const { result } = renderHook(() => useInquiryWrite());

    expect(result.current.userEmail).toBe("me@test.com");
    expect(result.current.isUserSuccess).toBe(true);
    expect(mockUsePostInquiry).toHaveBeenCalledWith(true);
    expect(result.current.isInquiryPending).toBe(false);
  });

  it("내 정보 미확정이면 빈 문자열 이메일을 돌려주며 문의 생성 훅에는 isUserSuccess false로 넘긴다", () => {
    mockUseGetUsersMe.mockReturnValue({
      data: undefined,
      isSuccess: false,
    } as unknown as ReturnType<typeof useGetUsersMe>);

    const { result } = renderHook(() => useInquiryWrite());

    expect(result.current.userEmail).toBe("");
    expect(result.current.isUserSuccess).toBe(false);
    expect(mockUsePostInquiry).toHaveBeenCalledWith(false);
  });

  it("isInquiryPending이 usePostInquiry 결과를 그대로 노출한다", () => {
    mockUseGetUsersMe.mockReturnValue({
      data: undefined,
      isSuccess: false,
    } as unknown as ReturnType<typeof useGetUsersMe>);
    mockUsePostInquiry.mockImplementation(
      () =>
        ({
          mutate,
          isPending: true,
        }) as unknown as ReturnType<typeof usePostInquiry>
    );

    const { result } = renderHook(() => useInquiryWrite());
    expect(result.current.isInquiryPending).toBe(true);
  });

  it("제출 시 inquiry JSON 블랍과 resized 이미지 파일을 FormData에 담아 mutate를 호출한다", async () => {
    mockUseGetUsersMe.mockReturnValue({
      data: undefined,
      isSuccess: false,
    } as unknown as ReturnType<typeof useGetUsersMe>);
    const file = createFile();
    const resizedFile = new File(["y"], "b.png", { type: "image/png" });
    mockResizeImage.mockResolvedValue(resizedFile);

    const { result } = renderHook(() => useInquiryWrite());

    await act(async () => {
      await result.current.onSubmit({
        ...stubFormPayload,
        images: [{ file, previewUrl: "blob:1" }],
      });
    });

    expect(mockResizeImage).toHaveBeenCalledWith(file);
    expect(mutate).toHaveBeenCalledTimes(1);

    const formData = mutate.mock.calls[0][0] as FormData;
    const inquiryBlob = formData.get("inquiry") as Blob;
    const inquiryJson = JSON.parse(await readFormDataBlobPartAsUtf8(inquiryBlob));
    expect(inquiryJson).toEqual(stubFormPayload);

    expect(formData.getAll("images")).toEqual([resizedFile]);
  });

  it("resizeImage가 실패하면 원본 파일로 images에 붙인다", async () => {
    mockUseGetUsersMe.mockReturnValue({
      data: undefined,
      isSuccess: false,
    } as unknown as ReturnType<typeof useGetUsersMe>);
    const file = createFile();
    mockResizeImage.mockRejectedValueOnce(new Error("resize fail"));

    const { result } = renderHook(() => useInquiryWrite());

    await act(async () => {
      await result.current.onSubmit({
        ...stubFormPayload,
        images: [{ file, previewUrl: "blob:1" }],
      });
    });

    const formData = mutate.mock.calls[0][0] as FormData;
    expect(formData.getAll("images")).toEqual([file]);
  });

  it("파일 없는 이미지 항목은 FormData에서 제외한다", async () => {
    mockUseGetUsersMe.mockReturnValue({
      data: undefined,
      isSuccess: false,
    } as unknown as ReturnType<typeof useGetUsersMe>);
    mockResizeImage.mockResolvedValue(createFile());

    const { result } = renderHook(() => useInquiryWrite());

    await act(async () => {
      await result.current.onSubmit({
        ...stubFormPayload,
        images: [{ previewUrl: "only-preview" }],
      });
    });

    const formData = mutate.mock.calls[0][0] as FormData;
    expect(formData.getAll("images")).toEqual([]);
  });
});
