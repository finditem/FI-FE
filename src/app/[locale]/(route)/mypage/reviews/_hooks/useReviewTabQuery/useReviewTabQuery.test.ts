import { act, renderHook } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useReviewTabQuery } from "./useReviewTabQuery";

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

describe("useReviewTabQuery", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUsePathname.mockReturnValue("/mypage/reviews");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("tab 쿼리가 없으면 기본값 received이다", () => {
    const { result } = renderHook(() => useReviewTabQuery());

    expect(result.current.tab).toBe("received");
  });

  it("tab 쿼리가 sent/hidden이면 그대로 반영한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=sent"));
    expect(renderHook(() => useReviewTabQuery()).result.current.tab).toBe("sent");

    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=hidden"));
    expect(renderHook(() => useReviewTabQuery()).result.current.tab).toBe("hidden");
  });

  it("비정상 tab 값이면 기본값 received로 폴백한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=unknown"));

    expect(renderHook(() => useReviewTabQuery()).result.current.tab).toBe("received");
  });

  it("updateTabQuery(sent)는 tab 쿼리를 설정하고 scroll:false로 replace한다", () => {
    const { result } = renderHook(() => useReviewTabQuery());

    act(() => result.current.updateTabQuery("sent"));

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace.mock.calls[0][1]).toEqual({ scroll: false });
    expect(parseQueryPath(mockReplace.mock.calls[0][0]).get("tab")).toBe("sent");
  });

  it("updateTabQuery(received)는 기본값이라 tab 쿼리를 제거한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=sent"));

    const { result } = renderHook(() => useReviewTabQuery());
    act(() => result.current.updateTabQuery("received"));

    expect(parseQueryPath(mockReplace.mock.calls[0][0]).has("tab")).toBe(false);
  });

  it("쿼리가 비게 되면 pathname만 replace한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=hidden"));

    const { result } = renderHook(() => useReviewTabQuery());
    act(() => result.current.updateTabQuery("received"));

    expect(mockReplace.mock.calls[0][0]).toBe("/mypage/reviews");
  });

  it("다른 쿼리는 보존하면서 tab만 갱신한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("foo=1&tab=sent"));

    const { result } = renderHook(() => useReviewTabQuery());
    act(() => result.current.updateTabQuery("hidden"));

    const params = parseQueryPath(mockReplace.mock.calls[0][0]);
    expect(params.get("foo")).toBe("1");
    expect(params.get("tab")).toBe("hidden");
  });
});
