import { renderHook } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { usePublicDataDetailQuery } from "./usePublicDataDetailQuery";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(() => ({ data: undefined, isLoading: false, isError: false })),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockFetch = jest.fn();

const getLastOptions = () => mockUseQuery.mock.calls.at(-1)[0];

const mockFetchResponse = (body: unknown, ok = true) => {
  mockFetch.mockResolvedValue({ ok, json: async () => body });
};

describe("usePublicDataDetailQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
    mockFetchResponse({ items: { item: { atcId: "F123" } } });
  });

  describe("queryKey / enabled", () => {
    it("queryKey에 atcId와 type이 포함된다", () => {
      renderHook(() => usePublicDataDetailQuery("F123", "found"));
      expect(getLastOptions().queryKey).toEqual(["publicDataDetail", "F123", "found"]);
    });

    it("type 기본값은 found다", () => {
      renderHook(() => usePublicDataDetailQuery("F123"));
      expect(getLastOptions().queryKey).toEqual(["publicDataDetail", "F123", "found"]);
    });

    it("atcId가 있으면 enabled는 true다", () => {
      renderHook(() => usePublicDataDetailQuery("F123", "lost"));
      expect(getLastOptions().enabled).toBe(true);
    });

    it("atcId가 빈 문자열이면 enabled는 false다", () => {
      renderHook(() => usePublicDataDetailQuery("", "lost"));
      expect(getLastOptions().enabled).toBe(false);
    });
  });

  describe("queryFn", () => {
    it("type=found이면 /api/public/found 엔드포인트에 요청한다", async () => {
      renderHook(() => usePublicDataDetailQuery("F123", "found"));
      await getLastOptions().queryFn();
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/api/public/found"));
    });

    it("type=lost이면 /api/public/lost 엔드포인트에 요청한다", async () => {
      renderHook(() => usePublicDataDetailQuery("L123", "lost"));
      await getLastOptions().queryFn();
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/api/public/lost"));
    });

    it("atcId를 쿼리파라미터로 포함해서 요청한다", async () => {
      renderHook(() => usePublicDataDetailQuery("F123", "found"));
      await getLastOptions().queryFn();
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("atcId=F123"));
    });

    it("응답의 items.item을 반환한다", async () => {
      const item = { atcId: "F123", fdPrdtNm: "지갑" };
      mockFetchResponse({ items: { item } });
      renderHook(() => usePublicDataDetailQuery("F123", "found"));
      const result = await getLastOptions().queryFn();
      expect(result).toEqual(item);
    });

    it("items가 없으면 null을 반환한다", async () => {
      mockFetchResponse({ items: null });
      renderHook(() => usePublicDataDetailQuery("F123", "found"));
      const result = await getLastOptions().queryFn();
      expect(result).toBeNull();
    });

    it("응답이 ok가 아니면 에러를 던진다", async () => {
      mockFetchResponse({}, false);
      renderHook(() => usePublicDataDetailQuery("F123", "found"));
      await expect(getLastOptions().queryFn()).rejects.toThrow("데이터를 불러오지 못했어요");
    });
  });
});
