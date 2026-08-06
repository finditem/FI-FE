import { renderHook } from "@testing-library/react";
import { useParams } from "next/navigation";
import { usePublicDataDetailQuery } from "../usePublicDataDetailQuery/usePublicDataDetailQuery";
import { usePublicClientDetail } from "./usePublicClientDetail";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("../usePublicDataDetailQuery/usePublicDataDetailQuery", () => ({
  usePublicDataDetailQuery: jest.fn(),
}));

const mockUseParams = useParams as jest.Mock;
const mockUsePublicDataDetailQuery = usePublicDataDetailQuery as jest.Mock;

const baseItem = {
  atcId: "F001",
  fdPrdtNm: "지갑",
  fdSbjt: "분실 내용",
  fdFilePathImg: "https://example.com/img.jpg",
  fdYmd: "2024-01-01",
  depPlace: "서울역 유실물센터",
  fdPlace: "2호선 강남역",
  uniq: "습득 고유번호",
  tel: "02-1234-5678",
  prdtClNm: "지갑",
  rnum: "1",
};

describe("usePublicClientDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ type: "found" });
  });

  describe("로딩·에러 상태", () => {
    it("isLoading이 true이면 detailData는 null이다", () => {
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData).toBeNull();
      expect(result.current.isLoading).toBe(true);
    });

    it("isError가 true이면 detailData는 null이다", () => {
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData).toBeNull();
      expect(result.current.isError).toBe(true);
    });

    it("로딩 완료 후 data가 없으면 isError를 true로 반환한다", () => {
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData).toBeNull();
      expect(result.current.isError).toBe(true);
    });
  });

  describe("데이터 변환 — found 타입", () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ type: "found" });
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: baseItem,
        isLoading: false,
        isError: false,
      });
    });

    it("isLost는 false다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.isLost).toBe(false);
    });

    it("content는 uniq 값이다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.content).toBe(baseItem.uniq);
    });

    it("place는 fdPlace 값이다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.place).toBe(baseItem.fdPlace);
    });
  });

  describe("데이터 변환 — lost 타입", () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ type: "lost" });
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: baseItem,
        isLoading: false,
        isError: false,
      });
    });

    it("isLost는 true다", () => {
      const { result } = renderHook(() => usePublicClientDetail("L001"));
      expect(result.current.detailData?.isLost).toBe(true);
    });

    it("content는 fdSbjt 값이다", () => {
      const { result } = renderHook(() => usePublicClientDetail("L001"));
      expect(result.current.detailData?.content).toBe(baseItem.fdSbjt);
    });

    it("place는 depPlace 값이다", () => {
      const { result } = renderHook(() => usePublicClientDetail("L001"));
      expect(result.current.detailData?.place).toBe(baseItem.depPlace);
    });
  });

  describe("imageSrc", () => {
    it("유효한 이미지 URL이면 imageSrc를 그대로 반환한다", () => {
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: baseItem,
        isLoading: false,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.imageSrc).toBe(baseItem.fdFilePathImg);
    });

    it("fdFilePathImg가 no_img.gif를 포함하면 imageSrc는 null이다", () => {
      const item = { ...baseItem, fdFilePathImg: "https://example.com/no_img.gif" };
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: item,
        isLoading: false,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.imageSrc).toBeNull();
    });

    it("fdFilePathImg가 없으면 imageSrc는 null이다", () => {
      const item = { ...baseItem, fdFilePathImg: "" };
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: item,
        isLoading: false,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.imageSrc).toBeNull();
    });
  });

  describe("배열 데이터 처리", () => {
    it("data가 배열이면 첫 번째 요소를 사용한다", () => {
      const items = [baseItem, { ...baseItem, atcId: "F002", fdPrdtNm: "휴대폰" }];
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: items,
        isLoading: false,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.title).toBe(baseItem.fdPrdtNm);
    });
  });

  describe("headerData 구조", () => {
    beforeEach(() => {
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: baseItem,
        isLoading: false,
        isError: false,
      });
    });

    it("headerData.id는 atcId다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.headerData.id).toBe(baseItem.atcId);
    });

    it("imageSrc가 있으면 imageResponseList에 THUMBNAIL 항목이 포함된다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.headerData.imageResponseList).toEqual([
        { id: 1, imgUrl: baseItem.fdFilePathImg, imageType: "THUMBNAIL" },
      ]);
    });

    it("imageSrc가 null이면 imageResponseList는 빈 배열이다", () => {
      const item = { ...baseItem, fdFilePathImg: "" };
      mockUsePublicDataDetailQuery.mockReturnValue({
        data: item,
        isLoading: false,
        isError: false,
      });
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.headerData.imageResponseList).toEqual([]);
    });

    it("headerData.userData.nickName은 depPlace다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.headerData.userData.nickName).toBe(baseItem.depPlace);
    });

    it("headerData.phoneNumber는 tel이다", () => {
      const { result } = renderHook(() => usePublicClientDetail("F001"));
      expect(result.current.detailData?.headerData.phoneNumber).toBe(baseItem.tel);
    });
  });
});
