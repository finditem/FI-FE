import { renderHook } from "@testing-library/react";
import useOAuthLoginCallback from "./useOAuthLoginCallback";

const mockReloadWithLocale = jest.fn();
const mockLoginMutate = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("code=kakao-code&state=oauth-state"),
}));

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn(), refresh: jest.fn() }),
  reloadWithLocale: (...args: unknown[]) => mockReloadWithLocale(...args),
}));

jest.mock("@/store", () => ({
  useAgreeStore: () => ({ termsAgreed: false, isLoggedIn: false, login: jest.fn() }),
}));

jest.mock("@/api/fetch/user", () => ({
  usePatchKakaoTerms: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  verifyOAuthState: () => true,
}));

const renderCallback = () =>
  renderHook(() => useOAuthLoginCallback({ provider: "kakao", loginMutate: mockLoginMutate }));

describe("useOAuthLoginCallback 로그인 언어 복원", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("영어에서 로그인을 시작했으면 로그인 요청 전에 영어 콜백 주소로 옮긴다", () => {
    sessionStorage.setItem("oauthLocale", "en");

    renderCallback();

    expect(mockReloadWithLocale).toHaveBeenCalledWith(
      "/auth/kakao/callback",
      "en",
      "code=kakao-code&state=oauth-state"
    );
    expect(mockLoginMutate).not.toHaveBeenCalled();
  });

  it("현재 언어에서 로그인을 시작했으면 옮기지 않고 로그인 요청을 보낸다", () => {
    sessionStorage.setItem("oauthLocale", "ko");

    renderCallback();

    expect(mockReloadWithLocale).not.toHaveBeenCalled();
    expect(mockLoginMutate).toHaveBeenCalledWith(
      expect.objectContaining({ code: "kakao-code" }),
      expect.any(Object)
    );
    expect(sessionStorage.getItem("oauthLocale")).toBeNull();
  });

  it("저장된 언어가 없으면 옮기지 않고 로그인 요청을 보낸다", () => {
    renderCallback();

    expect(mockReloadWithLocale).not.toHaveBeenCalled();
    expect(mockLoginMutate).toHaveBeenCalledTimes(1);
  });
});
