import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import InputChat from "./InputChat";
import "@testing-library/jest-dom";

jest.mock("@/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
  textareaAutoResize: jest.fn(),
  fileInputHandler: jest.fn(),
  textareaSubmitKeyHandler: jest.fn(),
}));

jest.mock("@/components/common/Icon/Icon", () => {
  const MockIcon = ({ name }: { name: string }) => <div data-testid="icon">{name}</div>;
  MockIcon.displayName = "MockIcon";
  return {
    __esModule: true,
    default: MockIcon,
  };
});

const renderComponent = (props: Partial<React.ComponentProps<typeof InputChat>> = {}) => {
  const defaultProps = {
    name: "test-chat",
    roomId: 1,
    userId: 1,
    withdrawn: false,
  };
  const mergedProps = { ...defaultProps, ...props };

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
      defaultValues: {
        [mergedProps.name]: "",
      },
      mode: "onChange",
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  const user = userEvent.setup();

  const utils = render(<InputChat {...mergedProps} />, { wrapper: Wrapper });

  return {
    ...utils,
    user,
    props: mergedProps,
  };
};

describe("InputChat 컴포넌트", () => {
  it("필수 요소들이 올바르게 렌더링 되는지 확인", () => {
    renderComponent();

    expect(screen.getByLabelText("이미지 첨부")).toBeInTheDocument();
    expect(screen.getByText("Image")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("메시지 보내기")).toBeInTheDocument();

    expect(screen.getByLabelText("전송 버튼")).toBeInTheDocument();
    expect(screen.getByText("SendArrow")).toBeInTheDocument();
  });

  it("입력창에 텍스트를 입력할 수 있는지 확인", async () => {
    const { user } = renderComponent();
    const input = screen.getByPlaceholderText<HTMLTextAreaElement>("메시지 보내기");

    await user.type(input, "안녕하세요");
    expect(input.value).toBe("안녕하세요");
  });

  it("텍스트 입력 시 입력창에 'text-neutral-strong-focused' 클래스가 적용되는지 확인", async () => {
    const { user } = renderComponent();
    const input = screen.getByPlaceholderText("메시지 보내기");

    expect(input).not.toHaveClass("text-neutral-strong-focused");

    await user.type(input, "A");
    expect(input).toHaveClass("text-neutral-strong-focused");
  });

  it("전송 버튼이 비어있는 입력값일 때 비활성화되는지 확인", () => {
    renderComponent();
    const sendButton = screen.getByLabelText("전송 버튼");

    expect(sendButton).toBeDisabled();
  });

  it("전송 버튼이 입력값이 있을 때 활성화되는지 확인", async () => {
    const { user } = renderComponent();
    const input = screen.getByPlaceholderText("메시지 보내기");
    const sendButton = screen.getByLabelText("전송 버튼");

    await user.type(input, "테스트 메시지");
    expect(sendButton).not.toBeDisabled();
  });

  it("disabled prop이 true일 때 입력창이 비활성화되는지 확인", () => {
    renderComponent({ disabled: true });

    const input = screen.getByPlaceholderText("메시지 보내기");
    expect(input).toBeDisabled();
  });

  it("disabled prop이 true일 때 전송 버튼이 비활성화되는지 확인", () => {
    renderComponent({ disabled: true });

    const sendButton = screen.getByLabelText("전송 버튼");
    expect(sendButton).toBeDisabled();
  });

  it("withdrawn이 true이면 입력창·전송이 비활성화되고 탈퇴 안내 placeholder를 쓴다", () => {
    renderComponent({ withdrawn: true });

    const input = screen.getByPlaceholderText("상대방이 탈퇴한 회원입니다.");
    expect(input).toBeDisabled();

    const sendButton = screen.getByLabelText("전송 버튼");
    expect(sendButton).toBeDisabled();
  });
});
