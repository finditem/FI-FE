import { renderHook, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import * as heightUtils from "../../_utils/heightUtils";
import useBottomSheetHeight from "./useBottomSheetHeight";

jest.mock("framer-motion", () => {
  const React = require("react") as typeof import("react");

  const createMotionValue = (initial: number) => {
    let value = initial;
    const listeners = new Set<(v: number) => void>();
    return {
      get: () => value,
      set: (next: number) => {
        value = next;
        listeners.forEach((l) => {
          l(next);
        });
      },
      on(event: string, listener: (v: number) => void) {
        if (event !== "change") {
          return () => {};
        }
        listeners.add(listener);
        return () => void listeners.delete(listener);
      },
    };
  };

  return {
    animate: jest.fn(),
    useMotionValue(initial: number) {
      const ref = React.useRef<ReturnType<typeof createMotionValue> | null>(null);
      if (ref.current === null) {
        ref.current = createMotionValue(initial);
      }
      return ref.current;
    },
    useMotionValueEvent(
      mv: ReturnType<typeof createMotionValue>,
      event: string,
      callback: (latest: number) => void
    ) {
      React.useEffect(() => {
        const unsub = mv.on(event, callback);
        return unsub;
      }, [mv, event, callback]);
    },
  };
});

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
const mockGetSnapHeights = jest.mocked(heightUtils.getSnapHeights);
const mockGetMaxHeightPx = jest.mocked(heightUtils.getMaxHeightPx);

describe("useBottomSheetHeight", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockGetMaxHeightPx.mockReturnValue(800);
    mockGetSnapHeights.mockReturnValue([100, 400, 700]);
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

  it("스냅 목표 높이가 확장 임계값 이상이면 isFullyExpanded가 true다", async () => {
    mockGetSnapHeights.mockReturnValue([100, 400, 700]);

    const { result } = renderHook(() => useBottomSheetHeight(null));

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isFullyExpanded).toBe(true);
    });
  });

  it("스냅 목표 높이가 확장 임계값 미만이면 isFullyExpanded가 false다", async () => {
    mockGetSnapHeights.mockReturnValue([50, 120, 200]);

    const { result } = renderHook(() => useBottomSheetHeight(null));

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.isFullyExpanded).toBe(false);
  });
});
