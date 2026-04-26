import type { Meta, StoryObj } from "@storybook/nextjs";
import EmailLoginForm from "./EmailLoginForm";
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

const meta: Meta<typeof EmailLoginForm> = {
  title: "페이지/로그인 페이지/EmailLoginForm",
  component: EmailLoginForm,
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
          password: "",
          rememberId: false,
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
type Story = StoryObj<typeof EmailLoginForm>;

export const Default: Story = {};
