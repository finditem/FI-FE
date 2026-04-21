import { renderHook } from "@testing-library/react";

import { usePWA } from "@/providers/PWAProvider";
import { useAddToHomeScreen } from "./useAddToHomeScreen";

jest.mock("@/providers/PWAProvider");

describe("useAddToHomeScreen", () => {
  it("usePWA의 반환값을 그대로 반환한다", () => {
    const mockPWAValue = {
      canInstall: true,
      showPrompt: false,
      installApp: jest.fn(),
      incrementViewCount: jest.fn(),
      closePrompt: jest.fn(),
    };

    (usePWA as jest.Mock).mockReturnValue(mockPWAValue);

    const { result } = renderHook(() => useAddToHomeScreen());

    expect(result.current).toBe(mockPWAValue);
  });
});
