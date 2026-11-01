import { shareWithNative } from "./shareWithNative";

describe("shareWithNative", () => {
  const mockShare = jest.fn();

  beforeEach(() => {
    Object.defineProperty(navigator, "share", {
      value: mockShare,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("네이티브 공유를 실행한다", async () => {
    const metaData = {
      title: "제목",
      summary: "요약",
      link: "https://example.com",
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
    };

    await shareWithNative({ metaData });

    expect(mockShare).toHaveBeenCalledTimes(1);
    expect(mockShare).toHaveBeenCalledWith({
      title: "제목",
      text: "요약",
      url: "https://example.com",
    });
  });
});
