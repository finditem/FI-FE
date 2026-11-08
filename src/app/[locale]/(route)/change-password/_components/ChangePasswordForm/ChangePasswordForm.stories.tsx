import type { Meta, StoryObj } from "@storybook/nextjs";
import ChangePasswordForm from "./ChangePasswordForm";
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

const meta: Meta<typeof ChangePasswordForm> = {
  title: "페이지/비밀번호 변경 페이지/ChangePasswordForm",
  component: ChangePasswordForm,
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
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
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
type Story = StoryObj<typeof ChangePasswordForm>;

export const Default: Story = {};
