import { act, renderHook } from "@testing-library/react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePublicDataTabQuery } from "./usePublicDataTabQuery";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useParams: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseParams = useParams as jest.Mock;

describe("usePublicDataTabQuery", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUsePathname.mockReturnValue("/public-data");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUseParams.mockReturnValue({});
  });

  describe("activeTab 결정", () => {
    it("비검색 페이지에서 type 쿼리가 없으면 lost가 기본값이다", () => {
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.activeTab).toBe("lost");
    });

    it("비검색 페이지에서 type=found이면 activeTab은 found다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=found"));
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.activeTab).toBe("found");
    });

    it("비검색 페이지에서 type이 유효하지 않은 값이면 lost로 폴백한다", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=unknown"));
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.activeTab).toBe("lost");
    });

    it("검색 페이지에서 useParams의 type=found이면 activeTab은 found다", () => {
      mockUsePathname.mockReturnValue("/public-data/found/search");
      mockUseParams.mockReturnValue({ type: "found" });
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.activeTab).toBe("found");
    });

    it("검색 페이지에서 useParams에 type이 없으면 lost가 기본값이다", () => {
      mockUsePathname.mockReturnValue("/public-data/lost/search");
      mockUseParams.mockReturnValue({});
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.activeTab).toBe("lost");
    });

    it("검색 페이지에서는 searchParams의 type을 무시하고 params.type을 사용한다", () => {
      mockUsePathname.mockReturnValue("/public-data/found/search");
      mockUseSearchParams.mockReturnValue(new URLSearchParams("type=lost"));
      mockUseParams.mockReturnValue({ type: "found" });
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.activeTab).toBe("found");
    });
  });

  describe("handleTabChange", () => {
    it("비검색 페이지에서 탭 변경 시 /public-data?type={key}로 replace한다", () => {
      const { result } = renderHook(() => usePublicDataTabQuery());
      act(() => {
        result.current.handleTabChange("found");
      });
      expect(mockReplace).toHaveBeenCalledWith("/public-data?type=found");
    });

    it("검색 페이지에서 탭 변경 시 /public-data/{key}/search로 replace한다", () => {
      mockUsePathname.mockReturnValue("/public-data/lost/search");
      mockUseSearchParams.mockReturnValue(new URLSearchParams("keyword=지갑"));
      const { result } = renderHook(() => usePublicDataTabQuery());
      act(() => {
        result.current.handleTabChange("found");
      });
      expect(mockReplace).toHaveBeenCalledWith(
        expect.stringMatching(/^\/public-data\/found\/search\?/)
      );
    });

    it("검색 페이지에서 탭 변경 시 기존 쿼리스트링을 유지한다", () => {
      mockUsePathname.mockReturnValue("/public-data/lost/search");
      mockUseSearchParams.mockReturnValue(new URLSearchParams("keyword=지갑&region=LCA000"));
      const { result } = renderHook(() => usePublicDataTabQuery());
      act(() => {
        result.current.handleTabChange("found");
      });
      const calledUrl = mockReplace.mock.calls[0][0] as string;
      const params = new URL(calledUrl, "http://test.local").searchParams;
      expect(params.get("keyword")).toBe("지갑");
      expect(params.get("region")).toBe("LCA000");
    });
  });

  describe("PUBLIC_LIST_TABS", () => {
    it("분실·습득 두 탭을 반환한다", () => {
      const { result } = renderHook(() => usePublicDataTabQuery());
      expect(result.current.PUBLIC_LIST_TABS).toEqual([
        { label: "분실", key: "lost" },
        { label: "습득", key: "found" },
      ]);
    });
  });
});
