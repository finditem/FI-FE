import { renderHook, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import useBottomSheetHeight from "./useBottomSheetHeight";

jest.mock("framer-motion", () => ({
  animate: jest.fn(),
  useMotionValue: jest.fn((initial: number) => {
    let value = initial;
    return {
      get: () => value,
      set: (next: number) => {
        value = next;
      },
    };
  }),
  useMotionValueEvent: jest.fn(),
}));

jest.mock("../../_utils/heightUtils", () => ({
  getMaxHeightPx: jest.fn(() => 800),
  getSnapHeights: jest.fn(() => [100, 400, 700]),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/store", () => ({
  useMainKakaoMapStore: jest.fn((selector: (s: { markerSheetSnapSignal: number }) => unknown) =>
    selector({ markerSheetSnapSignal: 0 })
  ),
}));

const mockUseSearchParams = useSearchParams as jest.Mock;

describe("useBottomSheetHeight", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("마운트 후 isInitialized가 true가 된다", async () => {
    const { result } = renderHook(() => useBottomSheetHeight(null));

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });
  });

  it("search 쿼리가 있어도 초기화된다", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("search=역삼"));

    const { result } = renderHook(() => useBottomSheetHeight(null));

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });
  });
});
