import { render } from "@testing-library/react";
import { TermsProvider } from "./TermsProvider";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";

const mockReplace = jest.fn();
jest.mock("@/i18n/navigation", () => ({
  usePathname: () => "/login",
  useRouter: () => ({ replace: mockReplace }),
}));
beforeEach(() => {
  jest.clearAllMocks();
  useAgreeStore.getState().login(false);
});

it("이전 약관 상태가 남아 있어도 익명 사용자의 재로그인을 막지 않는다", () => {
  useAuthStore.getState().setStatus("anonymous");
  render(<TermsProvider>login</TermsProvider>);
  expect(mockReplace).not.toHaveBeenCalled();
});

it("서버가 확인한 로그인 사용자에게는 기존 약관 가드를 적용한다", () => {
  useAuthStore.getState().setStatus("authenticated");
  render(<TermsProvider>login</TermsProvider>);
  expect(mockReplace).toHaveBeenCalledWith("/auth/kakao/callback");
});
