import { renderHook, act } from "@testing-library/react";
import { useRoutingGard } from "./useRoutingGard";

const mockRouterReplace = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
  useSearchParams: () => mockUseSearchParams(),
}));

const mockAlert = jest.fn();
global.alert = mockAlert;

describe("useRoutingGard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockUseSearchParams.mockReturnValue({ get: (key: string) => (key === "step" ? "1" : null) });
  });

  describe("updateMaxStep", () => {
    it("updateMaxStep 함수를 반환한다", () => {
      const { result } = renderHook(() => useRoutingGard());
      expect(typeof result.current.updateMaxStep).toBe("function");
    });

    it("updateMaxStep 호출 시 sessionStorage에 저장된다", () => {
      const { result } = renderHook(() => useRoutingGard());
      act(() => {
        result.current.updateMaxStep(2);
      });
      expect(sessionStorage.getItem("signup-max-step")).toBe("2");
    });

    it("현재보다 작은 step으로 updateMaxStep 호출 시 값이 줄어들지 않는다", () => {
      const { result } = renderHook(() => useRoutingGard());
      act(() => {
        result.current.updateMaxStep(2);
      });
      act(() => {
        result.current.updateMaxStep(1);
      });
      expect(sessionStorage.getItem("signup-max-step")).toBe("2");
    });
  });

  describe("잘못된 step 접근", () => {
    it("step이 '1', '2' 외의 값이면 /sign-up?step=1로 리다이렉트된다", () => {
      mockUseSearchParams.mockReturnValue({ get: (key: string) => (key === "step" ? "99" : null) });
      renderHook(() => useRoutingGard());
      expect(mockRouterReplace).toHaveBeenCalledWith("/sign-up?step=1");
    });

    it("step이 maxStep보다 크면 alert가 표시된다", () => {
      mockUseSearchParams.mockReturnValue({ get: (key: string) => (key === "step" ? "2" : null) });
      renderHook(() => useRoutingGard());
      expect(mockAlert).toHaveBeenCalledWith("잘못된 접근이에요");
    });

    it("step이 maxStep보다 크면 maxStep URL로 리다이렉트된다", () => {
      mockUseSearchParams.mockReturnValue({ get: (key: string) => (key === "step" ? "2" : null) });
      renderHook(() => useRoutingGard());
      expect(mockRouterReplace).toHaveBeenCalledWith("/sign-up?step=1");
    });
  });
});
