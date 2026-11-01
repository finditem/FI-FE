import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, UseFormProps } from "react-hook-form";
import InputField from "./InputField";
import "@testing-library/jest-dom";

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

jest.mock("@/components/common/Icon/Icon", () => {
  const MockIcon = ({ name }: { name: string }) => <span>{name}</span>;
  MockIcon.displayName = "MockIcon";
  return {
    __esModule: true,
    default: MockIcon,
  };
});

jest.mock("@/components/common/Buttons/Button/Button", () => {
  const MockButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>;
  MockButton.displayName = "MockButton";
  return {
    __esModule: true,
    default: MockButton,
  };
});

jest.mock("../_internal/DeleteButton/DeleteButton", () => {
  const MockDeleteButton = ({ value, onDelete }: { value: string; onDelete: () => void }) =>
    value ? (
      <button data-testid="delete-button" onClick={onDelete}>
        Delete
      </button>
    ) : null;
  MockDeleteButton.displayName = "MockDeleteButton";
  return {
    __esModule: true,
    default: MockDeleteButton,
  };
});

jest.mock("../_internal/Label/Label", () => {
  const MockLabel = ({
    name,
    label,
    className,
  }: {
    name: string;
    label: string;
    className?: string;
  }) => (
    <label htmlFor={name} className={className}>
      {label}
    </label>
  );
  MockLabel.displayName = "MockLabel";
  return {
    __esModule: true,
    default: MockLabel,
  };
});

jest.mock("../_internal/Caption/Caption", () => {
  const MockCaption = ({ hasError, errorMessage }: { hasError?: boolean; errorMessage?: string }) =>
    // hasError와 errorMessage가 모두 true/존재할 때만 렌더링
    hasError && errorMessage ? <span data-testid="error-message">{errorMessage}</span> : null;
  MockCaption.displayName = "MockCaption";
  return {
    __esModule: true,
    default: MockCaption,
  };
});

jest.mock("../_internal/Counter/Counter", () => {
  const MockCounter = ({ isLength, maxLength }: { isLength: number; maxLength?: number }) =>
    maxLength ? (
      <div data-testid="counter">
        {isLength}/{maxLength}
      </div>
    ) : null;
  MockCounter.displayName = "MockCounter";
  return {
    __esModule: true,
    default: MockCounter,
  };
});

const renderComponent = (
  props: React.ComponentProps<typeof InputField>,
  formConfig: UseFormProps = {}
) => {
  const user = userEvent.setup();

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
      defaultValues: { [props.name]: "" },
      mode: "onChange",
      ...formConfig,
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  render(<InputField {...props} />, { wrapper: Wrapper });

  return {
    user,
    props,
    textarea: screen.getByLabelText(props.label as string) as HTMLTextAreaElement,
  };
};

const mockOnDelete = jest.fn();
jest.mock("../_internal/_hooks/useFormInput", () => ({
  useFormInput: () => ({
    onDelete: mockOnDelete,
  }),
}));

describe("InputField (Textarea) 컴포넌트", () => {
  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  // 테스트 1
  it("Label(Mock)과 textarea를 올바르게 렌더링하는지 확인", () => {
    renderComponent({ name: "intro", label: "소개" });

    expect(screen.getByText("소개")).toBeInTheDocument();
    expect(screen.getByLabelText("소개")).toBeInTheDocument();
  });

  // 테스트 2
  it("타이핑 시 값이 변경되고 DeleteButton(Mock)이 나타나는지 확인", async () => {
    const { user, textarea } = renderComponent({ name: "intro", label: "소개" });

    expect(textarea.value).toBe("");
    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();

    await user.type(textarea, "안녕하세요");

    expect(textarea.value).toBe("안녕하세요");
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  // 테스트 3
  it("DeleteButton(Mock) 클릭 시 useFormInput의 onDelete(Mock)를 호출한다", async () => {
    const { user, textarea } = renderComponent({ name: "intro", label: "소개" });

    await user.type(textarea, "텍스트");
    const deleteButton = screen.getByTestId("delete-button");
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith("intro"); // name prop
  });

  // 테스트 4
  it("maxLength가 있을 때 Counter(Mock)에 글자 수가 반영되는지 확인", async () => {
    const { user, textarea } = renderComponent({
      name: "intro",
      label: "소개",
      validation: { maxLength: 30 },
    });

    expect(screen.getByTestId("counter")).toHaveTextContent("0/30");

    await user.type(textarea, "열 글자입니다.");

    expect(screen.getByTestId("counter")).toHaveTextContent("8/30");
  });

  // 테스트 5
  it("RHF 에러 발생 시 에러 클래스가 적용되고 Caption(Mock)이 에러 메시지를 렌더링한다", async () => {
    const { textarea } = renderComponent({
      name: "intro",
      label: "소개",
      validation: {
        maxLength: { value: 5, message: "5자 이내로 입력해주세요." },
      },
    });

    // 네이티브 maxlength로는 6자 이상 입력이 막혀 RHF maxLength 에러가 나지 않음 — DOM value setter로 길이 초과 값을 넣고 input으로 동기화
    const setNativeValue = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    setNativeValue?.call(textarea, "123456");
    fireEvent.input(textarea, { target: { value: "123456" } });

    const errorMessage = await screen.findByTestId("error-message");

    expect(errorMessage).toHaveTextContent("5자 이내로 입력해주세요.");

    expect(textarea).toHaveClass("!border-system-warning");
  });
});
