import { renderHook } from "@testing-library/react";
import { useParams, useSearchParams } from "next/navigation";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { usePublicDataListQuery } from "./usePublicDataListQuery";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/api/_base/query/useAppInfiniteQuery", () =>
  jest.fn(() => ({ data: undefined, isLoading: false }))
);

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseAppInfiniteQuery = useAppInfiniteQuery as jest.Mock;

const getLastCallArgs = () =>
  mockUseAppInfiniteQuery.mock.calls.at(-1) as Parameters<typeof useAppInfiniteQuery>;

describe("usePublicDataListQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({});
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  describe("type 처리", () => {
    it("type이 없으면 lost 엔드포인트를 호출한다", () => {
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toMatch(/^\/public\/lost/);
    });

    it("type=found이면 found 엔드포인트를 호출한다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=found"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toMatch(/^\/public\/found/);
    });

    it("type=FOUND 대문자도 found로 처리한다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=FOUND"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toMatch(/^\/public\/found/);
    });

    it("type이 유효하지 않은 값이면 lost로 폴백한다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=unknown"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toMatch(/^\/public\/lost/);
    });

    it("searchParams에 type이 없고 useParams에 type이 있으면 params 값을 사용한다", () => {
      mockUseParams.mockReturnValue({ type: "found" });
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toMatch(/^\/public\/found/);
    });
  });

  describe("URL 파라미터 조립", () => {
    it("필터가 없으면 numOfRows=10만 포함한다", () => {
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toBe("/public/lost?numOfRows=10");
    });

    it("유효한 category 값이 있으면 PRDT_CL_CD_01을 추가한다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("category=PRA000"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toContain("PRDT_CL_CD_01=PRA000");
    });

    it("유효하지 않은 category 값이면 PRDT_CL_CD_01을 추가하지 않는다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("category=INVALID"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).not.toContain("PRDT_CL_CD_01");
    });

    it("lost 타입일 때 region은 LST_LCT_CD로 추가된다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("region=LCA000"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toContain("LST_LCT_CD=LCA000");
      expect(url).not.toContain("N_FD_LCT_CD");
    });

    it("found 타입일 때 region은 N_FD_LCT_CD로 추가된다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=found&region=LCA000"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toContain("N_FD_LCT_CD=LCA000");
      expect(url).not.toContain("LST_LCT_CD");
    });

    it("keyword가 있으면 PRDT_NM을 추가한다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("keyword=지갑"));
      renderHook(() => usePublicDataListQuery());
      const [, , url] = getLastCallArgs();
      expect(url).toContain("PRDT_NM=%EC%A7%80%EA%B0%91");
    });
  });

  describe("queryKey", () => {
    it("queryKey에 type, category, region, keyword가 포함된다", () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams("type=found&category=PRA000&region=LCA000&keyword=지갑")
      );
      renderHook(() => usePublicDataListQuery());
      const [, queryKey] = getLastCallArgs();
      expect(queryKey).toEqual(["publicDataList", "found", "PRA000", "LCA000", "지갑"]);
    });

    it("필터가 없으면 queryKey는 빈 문자열로 채워진다", () => {
      renderHook(() => usePublicDataListQuery());
      const [, queryKey] = getLastCallArgs();
      expect(queryKey).toEqual(["publicDataList", "lost", "", "", ""]);
    });
  });

  describe("getNextPageParam", () => {
    it("마지막 페이지면 undefined를 반환한다", () => {
      renderHook(() => usePublicDataListQuery());
      const [, , , options] = getLastCallArgs();
      const lastPage = { pageNo: 3, numOfRows: 10, totalCount: 30 };
      expect(options?.getNextPageParam?.(lastPage)).toBeUndefined();
    });

    it("다음 페이지가 있으면 다음 pageNo를 반환한다", () => {
      renderHook(() => usePublicDataListQuery());
      const [, , , options] = getLastCallArgs();
      const lastPage = { pageNo: 1, numOfRows: 10, totalCount: 30 };
      expect(options?.getNextPageParam?.(lastPage)).toBe(2);
    });
  });
});
