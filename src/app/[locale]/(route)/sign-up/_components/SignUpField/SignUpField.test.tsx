import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpField from "./SignUpField";

const mockUseSignUpBtnClick = jest.fn();
const mockTrigger = jest.fn();
const mockSetFocus = jest.fn();
const mockUseWatch = jest.fn();
const mockFormState = { isValid: false };

jest.mock("../../_hooks/useSignUpBtnClick", () => ({
  useSignUpBtnClick: () => mockUseSignUpBtnClick(),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    control: {},
    trigger: mockTrigger,
    setFocus: mockSetFocus,
    formState: mockFormState,
  }),
  useWatch: () => mockUseWatch(),
}));

jest.mock("@/components/layout", () => ({
  DetailHeader: ({ title }: any) => <header>{title}</header>,
}));

jest.mock("@/components/domain", () => ({
  FooterButton: ({ children, disabled, onClick }: any) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock("../SignUpItem/SignUpItem", () => ({
  __esModule: true,
  default: ({ label }: any) => <div data-testid={`signup-item-${label}`}>{label}</div>,
}));

const defaultBtnClickReturn = {
  handlerToClick: jest.fn(),
  isEmailAuthDisabled: false,
  isEmailDisabled: false,
  isEmailAuthVerified: false,
  isNicknameVerified: false,
  isNicknameDisabled: false,
  EmailPending: false,
  EmailCodePending: false,
  timer: 0,
};

describe("<SignUpField />", () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormState.isValid = false;
    mockUseSignUpBtnClick.mockReturnValue(defaultBtnClickReturn);
    mockUseWatch.mockReturnValue(false);
  });

  it("'회원가입' 헤더가 렌더된다", () => {
    render(<SignUpField onNext={mockOnNext} />);
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("'다음' 버튼이 렌더된다", () => {
    render(<SignUpField onNext={mockOnNext} />);
    expect(screen.getByRole("button", { name: "다음" })).toBeInTheDocument();
  });

  it("isValid=false이고 이메일/닉네임 미인증이면 '다음' 버튼이 비활성화된다", () => {
    render(<SignUpField onNext={mockOnNext} />);
    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  it("모든 조건 충족 시 '다음' 버튼 클릭하면 onNext가 호출된다", () => {
    mockFormState.isValid = true;
    mockUseWatch.mockReturnValue(true);
    mockUseSignUpBtnClick.mockReturnValue({
      ...defaultBtnClickReturn,
      isEmailAuthVerified: true,
      isNicknameVerified: true,
    });
    render(<SignUpField onNext={mockOnNext} />);
    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(mockOnNext).toHaveBeenCalled();
  });
});
