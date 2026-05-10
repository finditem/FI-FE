import { renderHook, act } from "@testing-library/react";
import { useSignUpSubmit } from "./useSignUpSubmit";

const mockRouterReplace = jest.fn();
const mockAddToast = jest.fn();
const mockHandlerApiError = jest.fn();
const mockSignUpMutate = jest.fn();
const mockSetFirstSignUp = jest.fn();
const mockQueryClientClear = jest.fn();
const mockUseApiSignUp = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("@/hooks/domain", () => ({
  useErrorToast: () => ({ handlerApiError: mockHandlerApiError }),
}));

jest.mock("@/api/fetch/auth", () => ({
  useApiSignUp: () => mockUseApiSignUp(),
}));

jest.mock("@/store", () => ({
  usePermissionStore: () => ({ setFirstSignUp: mockSetFirstSignUp }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ clear: mockQueryClientClear }),
}));

const mockSignUpData = {
  email: "test@test.com",
  password: "Password1!",
  nickname: "테스터",
  privacyPolicyAgreed: true,
  termsOfServiceAgreed: true,
  contentPolicyAgreed: true,
  marketingConsent: false,
};

describe("useSignUpSubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiSignUp.mockReturnValue({ mutate: mockSignUpMutate, isPending: false });
  });

  it("isPending 값을 반환한다", () => {
    mockUseApiSignUp.mockReturnValue({ mutate: mockSignUpMutate, isPending: true });
    const { result } = renderHook(() => useSignUpSubmit());
    expect(result.current.isPending).toBe(true);
  });

  describe("회원가입 성공", () => {
    beforeEach(() => {
      mockSignUpMutate.mockImplementation((_data: any, { onSuccess }: any) => onSuccess());
    });

    it("성공 시 setFirstSignUp(true)가 호출된다", () => {
      const { result } = renderHook(() => useSignUpSubmit());
      act(() => {
        result.current.submitSignUp(mockSignUpData);
      });
      expect(mockSetFirstSignUp).toHaveBeenCalledWith(true);
    });

    it("성공 시 queryClient.clear가 호출된다", () => {
      const { result } = renderHook(() => useSignUpSubmit());
      act(() => {
        result.current.submitSignUp(mockSignUpData);
      });
      expect(mockQueryClientClear).toHaveBeenCalled();
    });

    it("성공 시 router.replace('/')가 호출된다", () => {
      const { result } = renderHook(() => useSignUpSubmit());
      act(() => {
        result.current.submitSignUp(mockSignUpData);
      });
      expect(mockRouterReplace).toHaveBeenCalledWith("/");
    });

    it("성공 시 '회원가입이 완료되었어요.' 토스트가 표시된다", () => {
      const { result } = renderHook(() => useSignUpSubmit());
      act(() => {
        result.current.submitSignUp(mockSignUpData);
      });
      expect(mockAddToast).toHaveBeenCalledWith("회원가입이 완료되었어요.", "success");
    });
  });

  describe("회원가입 실패", () => {
    it("에러 코드가 있으면 handlerApiError가 호출된다", () => {
      const error = { response: { data: { code: "AUTH409-EMAIL_DUPLICATED" } } };
      mockSignUpMutate.mockImplementation((_data: any, { onError }: any) => onError(error));
      const { result } = renderHook(() => useSignUpSubmit());
      act(() => {
        result.current.submitSignUp(mockSignUpData);
      });
      expect(mockHandlerApiError).toHaveBeenCalled();
    });
  });
});
