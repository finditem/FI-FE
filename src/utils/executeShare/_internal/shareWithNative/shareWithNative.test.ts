import { MOCK_NATIVE_SHARE_META_DATA } from "@/mock/data";
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
    await shareWithNative({ metaData: MOCK_NATIVE_SHARE_META_DATA });

    expect(mockShare).toHaveBeenCalledTimes(1);
    expect(mockShare).toHaveBeenCalledWith({
      title: "제목",
      text: "요약",
      url: "https://example.com",
    });
  });
});
