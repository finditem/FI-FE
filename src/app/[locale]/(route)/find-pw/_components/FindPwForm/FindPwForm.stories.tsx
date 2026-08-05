import type { Meta, StoryObj } from "@storybook/nextjs";
import FindPwForm from "./FindPwForm";
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

const meta: Meta<typeof FindPwForm> = {
  title: "페이지/비밀번호 찾기 페이지/FindPwForm",
  component: FindPwForm,
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
type Story = StoryObj<typeof FindPwForm>;

export const Default: Story = {};
