import { renderHook } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { useFilterParams } from "./useFilterParams";

jest.mock("next/navigation");

const createSearchParams = (params: Record<string, string>) => ({
  get: (key: string) => params[key] ?? null,
});

describe("useFilterParams", () => {
  describe("Enum 정규화", () => {
    it("소문자 쿼리 파라미터를 대문자 Enum 값으로 정규화한다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        createSearchParams({ category: "electronics", sort: "latest" })
      );

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.category).toBe("ELECTRONICS");
      expect(result.current.sort).toBe("LATEST");
    });

    it("쿼리 파라미터가 없으면 undefined를 반환한다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(createSearchParams({}));

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.category).toBeUndefined();
      expect(result.current.sort).toBeUndefined();
      expect(result.current.status).toBeUndefined();
      expect(result.current.findStatus).toBeUndefined();
      expect(result.current.activity).toBeUndefined();
      expect(result.current.simpleSort).toBeUndefined();
      expect(result.current.reportStatus).toBeUndefined();
      expect(result.current.inquiryStatus).toBeUndefined();
    });
  });

  describe("find-status 파라미터 변환", () => {
    it("URL의 find-status를 findStatus로 변환한다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        createSearchParams({ "find-status": "found" })
      );

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.findStatus).toBe("FOUND");
    });
  });

  describe("변환 없이 그대로 반환하는 파라미터", () => {
    it("region, startDate, endDate는 원본 문자열을 반환한다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        createSearchParams({ region: "서울", startDate: "2024-01-01", endDate: "2024-12-31" })
      );

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.region).toBe("서울");
      expect(result.current.startDate).toBe("2024-01-01");
      expect(result.current.endDate).toBe("2024-12-31");
    });

    it("해당 파라미터가 없으면 null을 반환한다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(createSearchParams({}));

      const { result } = renderHook(() => useFilterParams());

      expect(result.current.region).toBeNull();
      expect(result.current.startDate).toBeNull();
      expect(result.current.endDate).toBeNull();
    });
  });
});
