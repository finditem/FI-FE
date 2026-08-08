import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpItem from "./SignUpItem";

const mockUseController = jest.fn();

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({ control: {} }),
  useController: () => mockUseController(),
}));

jest.mock("@/components/common", () => ({
  InputText: ({ label, btnOption, caption }: any) => (
    <div>
      <label>{label}</label>
      {btnOption?.btnLabel && <button type="button">{btnOption.btnLabel}</button>}
      {caption?.isSuccess && <span data-testid="success-caption">{caption.successMessage}</span>}
    </div>
  ),
}));

const baseProps = {
  label: "이메일",
  inputOption: { name: "email" as const },
  isVerified: false,
};

describe("<SignUpItem />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseController.mockReturnValue({
      field: { name: "email", value: "", onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() },
      fieldState: { error: undefined, isDirty: false },
    });
  });

  it("label이 렌더된다", () => {
    render(<SignUpItem {...baseProps} />);
    expect(screen.getByText("이메일")).toBeInTheDocument();
  });

  it("isVerified=false이면 성공 캡션이 렌더되지 않는다 (emailAuth 필드)", () => {
    render(
      <SignUpItem {...baseProps} inputOption={{ name: "emailAuth" as const }} isVerified={false} />
    );
    expect(screen.queryByTestId("success-caption")).not.toBeInTheDocument();
  });

  it("isVerified=true이면 성공 캡션이 렌더된다 (emailAuth 필드)", () => {
    render(
      <SignUpItem
        {...baseProps}
        inputOption={{ name: "emailAuth" as const }}
        isVerified={true}
        caption={{ successMessage: "인증 완료" }}
      />
    );
    expect(screen.getByTestId("success-caption")).toBeInTheDocument();
  });
});
