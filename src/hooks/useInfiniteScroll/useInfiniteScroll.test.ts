import { renderHook, waitFor } from "@testing-library/react";
import type { InViewHookResponse } from "react-intersection-observer";
import { useInView } from "react-intersection-observer";

import { useInfiniteScroll } from "./useInfiniteScroll";

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(),
}));

const mockUseInView = useInView as jest.MockedFunction<typeof useInView>;

const createInViewReturn = (inView: boolean, ref: jest.Mock = jest.fn()): InViewHookResponse => {
  const entry = undefined;
  const tuple = [ref, inView, entry] as unknown as InViewHookResponse;
  return Object.assign(tuple, { ref, inView, entry });
};

describe("useInfiniteScroll", () => {
  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inView이고 다음 페이지가 있으며 로딩 중이 아니면 fetchNextPage를 한 번 호출한다", async () => {
    mockUseInView.mockReturnValue(createInViewReturn(true));

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    expect(result.current.ref).toBeDefined();
  });

  it("inView가 false이면 fetchNextPage를 호출하지 않는다", () => {
    mockUseInView.mockReturnValue(createInViewReturn(false));

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("hasNextPage가 false이면 fetchNextPage를 호출하지 않는다", () => {
    mockUseInView.mockReturnValue(createInViewReturn(true));

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
      })
    );

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("isFetchingNextPage가 true이면 fetchNextPage를 호출하지 않는다", () => {
    mockUseInView.mockReturnValue(createInViewReturn(true));

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
      })
    );

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("hasNextPage가 undefined이면 fetchNextPage를 호출하지 않는다", () => {
    mockUseInView.mockReturnValue(createInViewReturn(true));

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: undefined,
        isFetchingNextPage: false,
      })
    );

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("inView가 false에서 true로 바뀌면 그때 fetchNextPage를 호출한다", async () => {
    const refFn = jest.fn();
    mockUseInView
      .mockReturnValueOnce(createInViewReturn(false, refFn))
      .mockReturnValue(createInViewReturn(true, refFn));

    const { rerender } = renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    expect(mockFetchNextPage).not.toHaveBeenCalled();

    rerender();

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });
  });

  it("inViewOptions를 전달하면 useInView에 그대로 전달한다", () => {
    const customOptions = { threshold: 0.5 };
    mockUseInView.mockReturnValue(createInViewReturn(false));

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        inViewOptions: customOptions,
      })
    );

    expect(mockUseInView).toHaveBeenCalledWith(customOptions);
  });

  it("inViewOptions를 생략하면 threshold 0 기본값으로 useInView를 호출한다", () => {
    mockUseInView.mockReturnValue(createInViewReturn(false));

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    expect(mockUseInView).toHaveBeenCalledWith({ threshold: 0 });
  });
});
