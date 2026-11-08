import type { Meta, StoryObj } from "@storybook/nextjs";
import DeleteAccountContainer from "./DeleteAccountContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof DeleteAccountContainer> = {
  title: "페이지/마이페이지/회원 탈퇴 페이지/DeleteAccountContainer",
  component: DeleteAccountContainer,
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
          reasons: [],
          otherReason: "",
          passwordConfirm: "",
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <FormProvider {...methods}>
            <div className="w-[390px]">
              <Story />
            </div>
          </FormProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof DeleteAccountContainer>;

export const Default: Story = {};
