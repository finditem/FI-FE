import useAppQuery from "@/api/_base/query/useAppQuery";
import { useGetPostTranslation } from "./useGetPostTranslation";

jest.mock("@/api/_base/query/useAppQuery");

const mockedUseAppQuery = jest.mocked(useAppQuery);

describe("useGetPostTranslation", () => {
  beforeEach(() => {
    mockedUseAppQuery.mockClear();
  });

  it("게시글 번역 조회 경로에 postId를 포함한다.", () => {
    useGetPostTranslation({ postId: 123 });

    expect(mockedUseAppQuery).toHaveBeenCalledWith(
      "auth",
      ["post-translation", 123],
      "/posts/123/translate",
      { enabled: true }
    );
  });

  it("enabled가 false이면 번역 조회를 비활성화한다.", () => {
    useGetPostTranslation({ postId: 123, enabled: false });

    expect(mockedUseAppQuery).toHaveBeenCalledWith(
      "auth",
      ["post-translation", 123],
      "/posts/123/translate",
      { enabled: false }
    );
  });
});
