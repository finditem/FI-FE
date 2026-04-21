import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ReplyForm from "./ReplyForm";

jest.mock("@/components/common", () => ({
  Button: ({ children, disabled, onClick, type }: any) => (
    <button data-testid="mock-button" disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  ),
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} data-testid="mock-image" />,
}));

describe("<ReplyForm />", () => {
  const defaultProps = {
    isThreadItem: false,
    onSubmit: jest.fn(),
  };

  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => "mock-url");
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("입력 값이 없으면 등록 버튼이 비활성화됩니다.", () => {
    render(<ReplyForm {...defaultProps} />);
    expect(screen.getByTestId("mock-button")).toBeDisabled();
  });

  it("텍스트 입력 시 등록 버튼이 활성화됩니다.", async () => {
    render(<ReplyForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("답글 작성란");
    await userEvent.type(textarea, "테스트 답글");
    expect(screen.getByTestId("mock-button")).not.toBeDisabled();
  });

  it("폼 제출 시 onSubmit이 호출되고 상태가 초기화됩니다.", async () => {
    render(<ReplyForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("답글 작성란");
    await userEvent.type(textarea, "테스트 답글");

    const form = textarea.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith("테스트 답글", null);
      expect(textarea).toHaveValue("");
    });
  });

  it("Enter 키 입력 시 폼이 제출됩니다.", async () => {
    HTMLFormElement.prototype.requestSubmit = function () {
      fireEvent.submit(this);
    };

    render(<ReplyForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText("답글 작성란");

    await userEvent.type(textarea, "엔터테스트{enter}");

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith("엔터테스트", null);
      expect(textarea).toHaveValue("");
    });
  });
});
