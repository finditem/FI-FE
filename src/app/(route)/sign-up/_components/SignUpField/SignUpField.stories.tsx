import type { Meta, StoryObj } from "@storybook/nextjs";
import SignUpField from "./SignUpField";
import { FormProvider, useForm } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof SignUpField> = {
  title: "페이지/회원가입 페이지/SignUpField",
  component: SignUpField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      const methods = useForm({
        defaultValues: {
          email: "",
          emailAuth: "",
          password: "",
          passwordConfirm: "",
          nickname: "",
          isEmailAuthVerified: false,
          isNicknameVerified: false,
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <FormProvider {...methods}>
              <div className="w-[390px]">
                <Story />
              </div>
            </FormProvider>
          </ToastProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SignUpField>;

export const Default: Story = {
  args: {
    onNext: () => {},
  },
};
