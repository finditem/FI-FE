import { renderHook, act } from "@testing-library/react";
import { useSignUpFlow } from "./useSignUpFlow";

const mockRouterPush = jest.fn();
const mockUseSearchParams = jest.fn();
const mockTrigger = jest.fn();
const mockGetValues = jest.fn();
const mockUpdateMaxStep = jest.fn();
const mockOnSubmit = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    trigger: mockTrigger,
    getValues: mockGetValues,
  }),
}));

jest.mock("./useRoutingGard", () => ({
  useRoutingGard: () => ({ updateMaxStep: mockUpdateMaxStep }),
}));

describe("useSignUpFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({ get: (key: string) => (key === "step" ? "1" : null) });
    mockTrigger.mockResolvedValue(true);
    mockGetValues.mockReturnValue({
      email: "test@test.com",
      password: "Password1!",
      nickname: "테스터",
      privacyPolicyAgreed: true,
      termsOfServiceAgreed: true,
      contentPolicyAgreed: true,
      marketingConsent: false,
    });
  });

  describe("step / termName", () => {
    it("searchParams에서 step을 반환한다", () => {
      mockUseSearchParams.mockReturnValue({ get: (key: string) => (key === "step" ? "2" : null) });
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      expect(result.current.step).toBe("2");
    });

    it("step이 없으면 기본값 '1'을 반환한다", () => {
      mockUseSearchParams.mockReturnValue({ get: () => null });
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      expect(result.current.step).toBe("1");
    });

    it("searchParams에서 termName을 반환한다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "term" ? "privacyPolicy" : null),
      });
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      expect(result.current.termName).toBe("privacyPolicy");
    });

    it("term이 없으면 termName이 빈 문자열이다", () => {
      mockUseSearchParams.mockReturnValue({ get: () => null });
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      expect(result.current.termName).toBe("");
    });
  });

  describe("onNext", () => {
    it("유효성 검사 통과 시 updateMaxStep과 router.push가 호출된다", async () => {
      mockTrigger.mockResolvedValue(true);
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      await act(async () => {
        await result.current.onNext(2);
      });
      expect(mockUpdateMaxStep).toHaveBeenCalledWith(2);
      expect(mockRouterPush).toHaveBeenCalledWith("/sign-up?step=2");
    });

    it("유효성 검사 실패 시 router.push가 호출되지 않는다", async () => {
      mockTrigger.mockResolvedValue(false);
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      await act(async () => {
        await result.current.onNext(2);
      });
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  describe("openTermDetail", () => {
    it("termKey와 함께 약관 상세 URL로 이동한다", () => {
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      act(() => {
        result.current.openTermDetail("privacyPolicy");
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/sign-up?step=2&term=privacyPolicy");
    });
  });

  describe("onAgreeTerm", () => {
    it("이전 step URL로 이동한다", async () => {
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      await act(async () => {
        await result.current.onAgreeTerm(2);
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/sign-up?step=2");
    });
  });

  describe("completeTerms", () => {
    it("유효성 검사 통과 시 onSubmit이 데이터와 함께 호출된다", async () => {
      mockTrigger.mockResolvedValue(true);
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      await act(async () => {
        await result.current.completeTerms();
      });
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it("유효성 검사 실패 시 onSubmit이 호출되지 않는다", async () => {
      mockTrigger.mockResolvedValue(false);
      const { result } = renderHook(() => useSignUpFlow({ onSubmit: mockOnSubmit }));
      await act(async () => {
        await result.current.completeTerms();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
