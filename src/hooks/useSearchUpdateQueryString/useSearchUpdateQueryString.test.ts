import { act, renderHook } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSearchUpdateQueryString from "./useSearchUpdateQueryString";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

const parseQueryPath = (pathWithQuery: string) => {
  const u = new URL(pathWithQuery, "http://test.local");
  return u.searchParams;
};

describe("useSearchUpdateQueryString", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush, replace: mockReplace });
    mockUsePathname.mockReturnValue("/list");
  });

  it("search 쿼리가 없으면 searchMode는 default다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    const { result } = renderHook(() => useSearchUpdateQueryString());

    expect(result.current.searchMode).toBe("default");
  });

  it("search 쿼리가 있으면 searchMode에 반영된다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("search=region"));

    const { result } = renderHook(() => useSearchUpdateQueryString());

    expect(result.current.searchMode).toBe("region");
  });

  it("searchUpdateQuery는 기본 routerMode에서 push로 이동한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("a=1"));

    const { result } = renderHook(() => useSearchUpdateQueryString());

    act(() => {
      result.current.searchUpdateQuery("b", "2");
    });

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPush.mock.calls[0][1]).toEqual({ scroll: false });

    const params = parseQueryPath(mockPush.mock.calls[0][0]);
    expect(params.get("a")).toBe("1");
    expect(params.get("b")).toBe("2");
  });

  it("routerMode가 replace면 replace로 이동한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    const { result } = renderHook(() => useSearchUpdateQueryString("replace"));

    act(() => {
      result.current.searchUpdateQuery("q", "x");
    });

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace.mock.calls[0][1]).toEqual({ scroll: false });

    const params = parseQueryPath(mockReplace.mock.calls[0][0]);
    expect(params.get("q")).toBe("x");
  });

  it("value가 없으면 해당 키를 삭제한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("a=1&b=2"));

    const { result } = renderHook(() => useSearchUpdateQueryString());

    act(() => {
      result.current.searchUpdateQuery("b");
    });

    const params = parseQueryPath(mockPush.mock.calls[0][0]);
    expect(params.get("a")).toBe("1");
    expect(params.has("b")).toBe(false);
  });

  it("pathname은 usePathname 결과를 쓴다", () => {
    mockUsePathname.mockReturnValue("/notice");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());

    const { result } = renderHook(() => useSearchUpdateQueryString());

    act(() => {
      result.current.searchUpdateQuery("page", "2");
    });

    expect(mockPush.mock.calls[0][0]).toMatch(/^\/notice\?/);
  });
});
