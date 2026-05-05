import { act, renderHook } from "@testing-library/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY, POST_TYPE } from "../../_constants/QUERY_PARAMS";
import useHomeFilterQuery from "./useHomeFilterQuery";

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

describe("useHomeFilterQuery", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUsePathname.mockReturnValue("/");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("쿼리가 비어 있으면 분류는 all, 카테고리 미선택이다", () => {
    const { result } = renderHook(() => useHomeFilterQuery());

    expect(result.current.selectedPostFilter).toBe("all");
    expect(result.current.categoryParam).toBe("");
    expect(result.current.isCategorySelected).toBe(false);
    expect(result.current.categoryFilterLabel).toBe("카테고리");
  });

  it("post-type 쿼리에 따라 selectedPostFilter가 바뀐다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(`${POST_TYPE}=lost`));

    const { result } = renderHook(() => useHomeFilterQuery());

    expect(result.current.selectedPostFilter).toBe("lost");
  });

  it("category 쿼리가 있으면 라벨과 선택 상태가 반영된다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(`${CATEGORY}=electronics`));

    const { result } = renderHook(() => useHomeFilterQuery());

    expect(result.current.categoryParam).toBe("ELECTRONICS");
    expect(result.current.isCategorySelected).toBe(true);
    expect(result.current.categoryFilterLabel).toBe("전자기기");
  });

  it("setFilterQuery로 post-type을 설정하면 replace 경로에 반영된다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("foo=1"));

    const { result } = renderHook(() => useHomeFilterQuery());

    act(() => {
      result.current.setFilterQuery(POST_TYPE, "find");
    });

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace.mock.calls[0][1]).toEqual({ scroll: false });

    const params = parseQueryPath(mockReplace.mock.calls[0][0]);
    expect(params.get("foo")).toBe("1");
    expect(params.get(POST_TYPE)).toBe("find");
  });

  it("post-type을 all로 설정하면 해당 키를 삭제한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(`${POST_TYPE}=lost`));

    const { result } = renderHook(() => useHomeFilterQuery());

    act(() => {
      result.current.setFilterQuery(POST_TYPE, "all");
    });

    const params = parseQueryPath(mockReplace.mock.calls[0][0]);
    expect(params.has(POST_TYPE)).toBe(false);
  });

  it("setFilterQuery로 category를 설정하면 소문자로 저장한다", () => {
    const { result } = renderHook(() => useHomeFilterQuery());

    act(() => {
      result.current.setFilterQuery(CATEGORY, "WALLET");
    });

    const params = parseQueryPath(mockReplace.mock.calls[0][0]);
    expect(params.get(CATEGORY)).toBe("wallet");
  });

  it("쿼리스트링이 비게 되면 pathname만 replace한다", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(`${POST_TYPE}=lost`));

    const { result } = renderHook(() => useHomeFilterQuery());

    act(() => {
      result.current.setFilterQuery(POST_TYPE, "all");
    });

    expect(mockReplace.mock.calls[0][0]).toBe("/");
  });
});
