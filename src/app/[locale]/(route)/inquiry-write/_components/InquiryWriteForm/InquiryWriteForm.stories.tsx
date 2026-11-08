import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { ToastProvider } from "@/providers/ToastProviders";
import { InquiryWriteFormValues } from "../../_types/InquiryWriteFormValues";
import InquiryWriteForm from "./InquiryWriteForm";

const inquiryDefaultValues: InquiryWriteFormValues = {
  title: "",
  email: "",
  inquiryType: "ETC",
  content: "",
  images: [],
};

function InquiryWriteFormDemo(
  props: Partial<
    Pick<ComponentProps<typeof InquiryWriteForm>, "userEmail" | "isUserSuccess" | "onSubmit">
  > & {
    defaultValues?: Partial<InquiryWriteFormValues>;
  }
) {
  const { defaultValues, onSubmit = () => undefined, ...rest } = props;
  const methods = useForm<InquiryWriteFormValues>({
    mode: "onChange",
    defaultValues: {
      ...inquiryDefaultValues,
      ...defaultValues,
    },
  });

  return (
    <InquiryWriteForm
      methods={methods}
      onSubmit={onSubmit}
      userEmail=""
      isUserSuccess={false}
      {...rest}
    />
  );
}

const meta: Meta<typeof InquiryWriteFormDemo> = {
  title: "페이지/1:1 문의 작성 페이지/InquiryWriteForm",
  component: InquiryWriteFormDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="w-[390px]">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InquiryWriteFormDemo>;

export const Default: Story = {};

export const WithPrefilledLoginEmail: Story = {
  args: {
    userEmail: "user@example.com",
    isUserSuccess: true,
  },
};

export const ExistingEmailKeepsUserInput: Story = {
  args: {
    defaultValues: { email: "already-filled@example.com" },
    userEmail: "other@example.com",
    isUserSuccess: true,
  },
};
