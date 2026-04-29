import type { Meta, StoryObj } from "@storybook/nextjs";
import DeleteAccountPassword from "./DeleteAccountPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import { FormProvider, useForm } from "react-hook-form";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof DeleteAccountPassword> = {
  title: "페이지/마이페이지/회원 탈퇴 페이지/DeleteAccountPassword",
  component: DeleteAccountPassword,
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
          passwordConfirm: "",
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
type Story = StoryObj<typeof DeleteAccountPassword>;

export const Default: Story = {
  args: {
    onBack: () => {},
  },
};
