import { executeShare } from "./executeShare";
import { shareWithCopyUrl, shareWithKakao, shareWithNative } from "./_internal";
import { MOCK_POST_META_DATA } from "@/mock/data";

jest.mock("./_internal", () => ({
  shareWithKakao: jest.fn(),
  shareWithNative: jest.fn(),
  shareWithCopyUrl: jest.fn(),
}));

const addToast = jest.fn();

describe("executeShare", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("kakao id를 받으면 카카오톡으로 공유한다", () => {
    executeShare({
      id: "kakao",
      metaData: MOCK_POST_META_DATA,
      objectType: "location",
      addToast,
    });

    expect(shareWithKakao).toHaveBeenCalledTimes(1);
    expect(shareWithKakao).toHaveBeenCalledWith(MOCK_POST_META_DATA, "location", undefined);
  });

  it("native id를 받으면 네이티브로 공유한다", () => {
    executeShare({
      id: "native",
      metaData: MOCK_POST_META_DATA,
      objectType: "location",
      addToast,
    });

    expect(shareWithNative).toHaveBeenCalledTimes(1);
    expect(shareWithNative).toHaveBeenCalledWith({ metaData: { ...MOCK_POST_META_DATA } });
  });

  it("copy id를 받으면 복사한다", () => {
    executeShare({
      id: "copy",
      metaData: MOCK_POST_META_DATA,
      objectType: "location",
      addToast,
    });

    expect(shareWithCopyUrl).toHaveBeenCalledTimes(1);
    expect(shareWithCopyUrl).toHaveBeenCalledWith(MOCK_POST_META_DATA.link, addToast, undefined);
  });
});
