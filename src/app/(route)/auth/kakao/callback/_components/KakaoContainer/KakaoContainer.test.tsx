import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import KakaoContainer from "./KakaoContainer";

const mockKakaoLoginMutate = jest.fn();
const mockKakaoPatchMutate = jest.fn();
const mockUseApiKakaoLogin = jest.fn();
const mockUsePatchKakaoTerms = jest.fn();
const mockUseAgreeStore = jest.fn();
const mockRouterReplace = jest.fn();
const mockRouterPush = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("@/api/fetch/auth", () => ({
  useApiKakaoLogin: () => mockUseApiKakaoLogin(),
}));

jest.mock("@/api/fetch/user", () => ({
  usePatchKakaoTerms: () => mockUsePatchKakaoTerms(),
}));

jest.mock("@/store", () => ({
  useAgreeStore: () => mockUseAgreeStore(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace, push: mockRouterPush }),
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock("../KakaoLoading/KakaoLoading", () => ({
  __esModule: true,
  default: () => <div data-testid="kakao-loading">로그인 요청 중...</div>,
}));

jest.mock("@/components/domain", () => ({
  TermsAgreement: ({ onComplete, onOpenDetail, isPending }: any) => (
    <div data-testid="terms-agreement">
      <button type="button" onClick={onComplete}>
        약관 완료
      </button>
      <button type="button" onClick={() => onOpenDetail("privacyPolicy")}>
        약관 상세
      </button>
      {isPending && <span>처리 중</span>}
    </div>
  ),
  Terms: ({ termName, onAgree }: any) => (
    <div data-testid="terms">
      <span data-testid="term-name">{termName}</span>
      <button type="button" onClick={onAgree}>
        동의
      </button>
    </div>
  ),
}));

jest.mock("@/components/state", () => ({
  ErrorView: () => <div data-testid="error-view">페이지를 찾을 수 없습니다.</div>,
}));

const noCodeParams = { get: (key: string) => (key === "code" ? null : null) };
const withCodeParams = { get: (key: string) => (key === "code" ? "test-auth-code" : null) };
const withTermNameParams = { get: (key: string) => (key === "termName" ? "privacyPolicy" : null) };

describe("<KakaoContainer />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiKakaoLogin.mockReturnValue({ mutate: mockKakaoLoginMutate });
    mockUsePatchKakaoTerms.mockReturnValue({ mutate: mockKakaoPatchMutate, isPending: false });
    mockUseAgreeStore.mockReturnValue({ termsAgreed: false, isLoggedIn: false, login: jest.fn() });
    mockUseSearchParams.mockReturnValue(noCodeParams);
  });

  describe("code 파라미터 있음 (Loading step)", () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(withCodeParams);
    });

    it("KakaoLoading이 렌더된다", () => {
      mockKakaoLoginMutate.mockImplementation(() => {});
      render(<KakaoContainer />);
      expect(screen.getByTestId("kakao-loading")).toBeInTheDocument();
    });

    it("마운트 시 KakaoLoginMutate가 code와 함께 호출된다", async () => {
      mockKakaoLoginMutate.mockImplementation(() => {});
      render(<KakaoContainer />);
      await waitFor(() => {
        expect(mockKakaoLoginMutate).toHaveBeenCalledWith(
          expect.objectContaining({ code: "test-auth-code" }),
          expect.any(Object)
        );
      });
    });
  });

  describe("onSuccess — termsAgreed=true", () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(withCodeParams);
      mockKakaoLoginMutate.mockImplementation((_payload: any, { onSuccess }: any) => {
        onSuccess({ result: { termsAgreed: true } });
      });
    });

    it("login(true)가 호출된다", async () => {
      const mockLogin = jest.fn();
      mockUseAgreeStore.mockReturnValue({
        termsAgreed: false,
        isLoggedIn: false,
        login: mockLogin,
      });
      render(<KakaoContainer />);
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(true);
      });
    });

    it("router.replace('/')가 호출된다", async () => {
      render(<KakaoContainer />);
      await waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("onSuccess — termsAgreed=false", () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(withCodeParams);
      mockKakaoLoginMutate.mockImplementation((_payload: any, { onSuccess }: any) => {
        onSuccess({ result: { termsAgreed: false } });
      });
    });

    it("login(false)가 호출된다", async () => {
      const mockLogin = jest.fn();
      mockUseAgreeStore.mockReturnValue({
        termsAgreed: false,
        isLoggedIn: false,
        login: mockLogin,
      });
      render(<KakaoContainer />);
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(false);
      });
    });

    it("step이 Term으로 변경되어 TermsAgreement가 렌더된다", async () => {
      render(<KakaoContainer />);
      await waitFor(() => {
        expect(screen.getByTestId("terms-agreement")).toBeInTheDocument();
      });
    });
  });

  describe("code 없음, isLoggedIn=true, termsAgreed=false (Term step)", () => {
    it("TermsAgreement가 렌더된다", () => {
      mockUseAgreeStore.mockReturnValue({ termsAgreed: false, isLoggedIn: true, login: jest.fn() });
      mockUseSearchParams.mockReturnValue(noCodeParams);
      render(<KakaoContainer />);
      expect(screen.getByTestId("terms-agreement")).toBeInTheDocument();
    });
  });

  describe("termName 파라미터 있음", () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(withTermNameParams);
    });

    it("Terms가 렌더된다", () => {
      render(<KakaoContainer />);
      expect(screen.getByTestId("terms")).toBeInTheDocument();
    });

    it("onAgree 클릭 시 router.push('/auth/kakao/callback')이 호출된다", () => {
      render(<KakaoContainer />);
      fireEvent.click(screen.getByRole("button", { name: "동의" }));
      expect(mockRouterPush).toHaveBeenCalledWith("/auth/kakao/callback");
    });
  });

  describe("code 없음, isLoggedIn=false (NoAction step)", () => {
    it("ErrorView가 렌더된다", () => {
      mockUseAgreeStore.mockReturnValue({
        termsAgreed: false,
        isLoggedIn: false,
        login: jest.fn(),
      });
      mockUseSearchParams.mockReturnValue(noCodeParams);
      render(<KakaoContainer />);
      expect(screen.getByTestId("error-view")).toBeInTheDocument();
    });
  });
});
