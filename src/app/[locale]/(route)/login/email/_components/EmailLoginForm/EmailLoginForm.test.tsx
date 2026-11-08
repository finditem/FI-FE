import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmailLoginForm from "./EmailLoginForm";

const mockUseLoginForm = jest.fn();

jest.mock("../../_hooks/useLoginForm", () => ({
  __esModule: true,
  default: () => mockUseLoginForm(),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: jest.fn(() => ({})),
    control: {},
  }),
  useWatch: jest.fn(() => false),
}));

jest.mock("@/components/common", () => ({
  InputText: ({ label, inputOption }: any) => (
    <div>
      <label htmlFor={inputOption?.name}>{label}</label>
      <input id={inputOption?.name} name={inputOption?.name} type={inputOption?.type} />
    </div>
  ),
  CheckBox: ({ label, id }: any) => (
    <label htmlFor={id}>
      <input id={id} type="checkbox" />
      {label}
    </label>
  ),
  Button: ({ children, loading, type }: any) => (
    <button type={type} aria-busy={loading}>
      {children}
    </button>
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock("../../../_components", () => ({
  LogoLink: () => <div data-testid="logo-link" />,
}));

describe("<EmailLoginForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoginForm.mockReturnValue({
      onSubmitLogin: jest.fn((e) => e.preventDefault()),
      isPending: false,
    });
  });

  describe("기본 렌더링", () => {
    it("아이디(이메일) 입력 필드가 렌더된다", () => {
      render(<EmailLoginForm />);
      expect(screen.getByLabelText("아이디(이메일)")).toBeInTheDocument();
    });

    it("비밀번호 입력 필드가 렌더된다", () => {
      render(<EmailLoginForm />);
      expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    });

    it("아이디 기억하기 체크박스가 렌더된다", () => {
      render(<EmailLoginForm />);
      expect(screen.getByLabelText("아이디 기억하기")).toBeInTheDocument();
    });

    it("로그인 버튼이 렌더된다", () => {
      render(<EmailLoginForm />);
      expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
    });

    it("비밀번호 찾기 링크가 /find-pw로 렌더된다", () => {
      render(<EmailLoginForm />);
      expect(screen.getByRole("link", { name: "비밀번호 찾기" })).toHaveAttribute(
        "href",
        "/find-pw"
      );
    });

    it("회원가입 링크가 /sign-up으로 렌더된다", () => {
      render(<EmailLoginForm />);
      expect(screen.getByRole("link", { name: "회원가입" })).toHaveAttribute("href", "/sign-up");
    });
  });

  describe("로그인 버튼 상태", () => {
    it("isPending=false이면 버튼의 aria-busy가 false이다", () => {
      mockUseLoginForm.mockReturnValue({ onSubmitLogin: jest.fn(), isPending: false });
      render(<EmailLoginForm />);
      expect(screen.getByRole("button", { name: "로그인" })).toHaveAttribute("aria-busy", "false");
    });

    it("isPending=true이면 버튼의 aria-busy가 true이다", () => {
      mockUseLoginForm.mockReturnValue({ onSubmitLogin: jest.fn(), isPending: true });
      render(<EmailLoginForm />);
      expect(screen.getByRole("button", { name: "로그인" })).toHaveAttribute("aria-busy", "true");
    });
  });

  describe("폼 제출", () => {
    it("폼 제출 시 onSubmitLogin이 호출된다", () => {
      const mockOnSubmitLogin = jest.fn((e) => e.preventDefault());
      mockUseLoginForm.mockReturnValue({ onSubmitLogin: mockOnSubmitLogin, isPending: false });
      const { container } = render(<EmailLoginForm />);
      fireEvent.submit(container.querySelector("form")!);
      expect(mockOnSubmitLogin).toHaveBeenCalled();
    });
  });
});
