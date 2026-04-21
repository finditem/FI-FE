import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useVWorldAddressSearch from "./useVWorldAddressSearch";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useVWorldAddressSearch", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("검색어가 2자 미만인 경우", () => {
    it("빈 문자열이면 API를 호출하지 않는다", () => {
      renderHook(() => useVWorldAddressSearch("", 0), { wrapper: createWrapper() });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("1자이면 API를 호출하지 않는다", () => {
      renderHook(() => useVWorldAddressSearch("서", 0), { wrapper: createWrapper() });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("검색어가 2자 이상인 경우", () => {
    it("API를 호출한다", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          response: { status: "OK", result: { items: [] } },
        }),
      });

      renderHook(() => useVWorldAddressSearch("서울", 0), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/vworld?query="));
      });
    });

    it("NOT_FOUND 응답이면 빈 배열을 반환한다", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ response: { status: "NOT_FOUND" } }),
      });

      const { result } = renderHook(() => useVWorldAddressSearch("없는주소", 0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual([]);
      });
    });

    it("성공 응답이면 items를 반환한다", async () => {
      const mockItem = {
        title: "서울시청",
        address: { road: "서울특별시 중구 세종대로 110", parcel: "서울특별시 중구 태평로1가 31" },
        point: { x: "126.9784", y: "37.5665" },
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          response: { status: "OK", result: { items: [mockItem] } },
        }),
      });

      const { result } = renderHook(() => useVWorldAddressSearch("서울시청", 0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual([mockItem]);
      });
    });

    it("API 요청이 실패하면 에러 상태가 된다", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      const { result } = renderHook(() => useVWorldAddressSearch("서울", 0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("디바운스", () => {
    it("delay 시간이 지나기 전에는 API를 호출하지 않는다", async () => {
      jest.useFakeTimers();

      const { rerender } = renderHook(({ query }) => useVWorldAddressSearch(query), {
        wrapper: createWrapper(),
        initialProps: { query: "" },
      });

      expect(global.fetch).not.toHaveBeenCalled();
      rerender({ query: "서울" });
      expect(global.fetch).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/vworld?query="));
      });

      jest.useRealTimers();
    });
  });
});
