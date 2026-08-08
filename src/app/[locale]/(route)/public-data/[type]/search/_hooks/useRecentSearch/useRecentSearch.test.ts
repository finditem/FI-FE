import { act, renderHook } from "@testing-library/react";
import { useRecentSearch } from "./useRecentSearch";

const STORAGE_KEY = "public_data_recent_search";

describe("useRecentSearch", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("초기 로드", () => {
    it("localStorage가 비어 있으면 recentSearches는 빈 배열이다", () => {
      const { result } = renderHook(() => useRecentSearch());
      expect(result.current.recentSearches).toEqual([]);
    });

    it("localStorage에 저장된 값이 있으면 초기 상태에 반영된다", () => {
      const stored = [{ keyword: "지갑", timestamp: 1000 }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      const { result } = renderHook(() => useRecentSearch());
      expect(result.current.recentSearches).toEqual(stored);
    });

    it("localStorage 값이 유효하지 않은 JSON이면 빈 배열로 초기화된다", () => {
      localStorage.setItem(STORAGE_KEY, "invalid json{{{");
      const { result } = renderHook(() => useRecentSearch());
      expect(result.current.recentSearches).toEqual([]);
    });
  });

  describe("addSearch", () => {
    it("새 키워드를 추가하면 목록 맨 앞에 위치한다", () => {
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.addSearch("지갑");
      });
      expect(result.current.recentSearches[0].keyword).toBe("지갑");
    });

    it("동일한 키워드를 추가하면 기존 항목이 제거되고 최상단으로 이동한다", () => {
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.addSearch("지갑");
        result.current.addSearch("휴대폰");
        result.current.addSearch("지갑");
      });
      expect(result.current.recentSearches[0].keyword).toBe("지갑");
      expect(result.current.recentSearches.filter((i) => i.keyword === "지갑")).toHaveLength(1);
    });

    it("10개 초과 시 가장 오래된 항목이 잘린다", () => {
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        for (let i = 1; i <= 11; i++) {
          result.current.addSearch(`키워드${i}`);
        }
      });
      expect(result.current.recentSearches).toHaveLength(10);
      expect(result.current.recentSearches[0].keyword).toBe("키워드11");
      expect(result.current.recentSearches.some((i) => i.keyword === "키워드1")).toBe(false);
    });

    it("추가 시 localStorage에 저장된다", () => {
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.addSearch("지갑");
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored[0].keyword).toBe("지갑");
    });

    it("timestamp는 Date.now() 값으로 기록된다", () => {
      jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.addSearch("지갑");
      });
      expect(result.current.recentSearches[0].timestamp).toBe(
        new Date("2024-01-01T00:00:00Z").getTime()
      );
    });
  });

  describe("removeSearch", () => {
    it("해당 키워드를 목록에서 제거한다", () => {
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.addSearch("지갑");
        result.current.addSearch("휴대폰");
      });
      act(() => {
        result.current.removeSearch("지갑");
      });
      expect(result.current.recentSearches.some((i) => i.keyword === "지갑")).toBe(false);
      expect(result.current.recentSearches).toHaveLength(1);
    });

    it("존재하지 않는 키워드를 제거해도 목록이 변하지 않는다", () => {
      const stored = [{ keyword: "지갑", timestamp: 1000 }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.removeSearch("없는키워드");
      });
      expect(result.current.recentSearches).toHaveLength(1);
    });

    it("제거 후 변경된 목록이 localStorage에 저장된다", () => {
      const { result } = renderHook(() => useRecentSearch());
      act(() => {
        result.current.addSearch("지갑");
        result.current.addSearch("휴대폰");
      });
      act(() => {
        result.current.removeSearch("지갑");
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.some((i: { keyword: string }) => i.keyword === "지갑")).toBe(false);
    });
  });
});
