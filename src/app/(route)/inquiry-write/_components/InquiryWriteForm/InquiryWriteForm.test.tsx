import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useForm, UseFormReturn } from "react-hook-form";
import { InquiryWriteFormValues } from "../../_types/InquiryWriteFormValues";
import InquiryWriteForm from "./InquiryWriteForm";

jest.mock("@/components/domain/WriteImageSection/WriteImageSection", () => ({
  __esModule: true,
  default: () => <div data-testid="write-image-section-mock" />,
}));

const defaults: InquiryWriteFormValues = {
  title: "",
  email: "",
  inquiryType: "ETC",
  content: "",
  images: [],
};

type SetupOptions = Partial<
  Pick<React.ComponentProps<typeof InquiryWriteForm>, "userEmail" | "isUserSuccess">
> & {
  defaultValues?: Partial<InquiryWriteFormValues>;
};

const setupForm = ({
  defaultValues,
  ...formProps
}: SetupOptions): { onSubmit: jest.Mock; methods: UseFormReturn<InquiryWriteFormValues> } => {
  const onSubmit = jest.fn();
  const holder: { current?: UseFormReturn<InquiryWriteFormValues> } = {};

  const Wrapper = () => {
    const methods = useForm<InquiryWriteFormValues>({
      mode: "onChange",
      defaultValues: {
        ...defaults,
        ...defaultValues,
      },
    });
    holder.current = methods;
    return (
      <InquiryWriteForm
        methods={methods}
        onSubmit={onSubmit}
        userEmail=""
        isUserSuccess={false}
        {...formProps}
      />
    );
  };

  render(<Wrapper />);

  return { onSubmit, methods: holder.current! };
};

describe("InquiryWriteForm", () => {
  it("문의 폼 필드와 이미지 영역이 렌더된다", () => {
    setupForm({});
    expect(screen.getByPlaceholderText("문의 제목을 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("이메일을 입력해주세요.")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/이용하며 느끼신 불편한 점이나 바라는 점을 알려주세요/)
    ).toBeInTheDocument();
    expect(screen.getByTestId("write-image-section-mock")).toBeInTheDocument();
  });

  it("로그인 사용자 이메일이 있고 조회 성공 시 이메일 필드에 자동으로 채운다", async () => {
    setupForm({ userEmail: "user@example.com", isUserSuccess: true });
    await waitFor(() =>
      expect(screen.getByPlaceholderText("이메일을 입력해주세요.")).toHaveValue("user@example.com")
    );
    expect(screen.getByPlaceholderText("이메일을 입력해주세요.")).toBeDisabled();
  });

  it("이미 이메일이 있으면 userEmail으로 덮어쓰지 않는다", async () => {
    setupForm({
      defaultValues: { email: "keep@example.com" },
      userEmail: "new@example.com",
      isUserSuccess: true,
    });
    await waitFor(() =>
      expect(screen.getByPlaceholderText("이메일을 입력해주세요.")).toHaveValue("keep@example.com")
    );
    expect(screen.getByPlaceholderText("이메일을 입력해주세요.")).toBeDisabled();
  });

  it("handleSubmit 호출 시 onSubmit에 현재 필드 값이 전달된다", async () => {
    const { onSubmit, methods } = setupForm({});

    act(() => {
      methods.setValue("title", "테스트 제목", { shouldDirty: true, shouldValidate: true });
      methods.setValue("email", "t@example.com", { shouldDirty: true, shouldValidate: true });
      methods.setValue("content", "내용입니다", { shouldDirty: true, shouldValidate: true });
    });

    await act(async () => {
      await methods.handleSubmit(onSubmit)();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      title: "테스트 제목",
      email: "t@example.com",
      inquiryType: "ETC",
      content: "내용입니다",
    });
  });
});
