import type { Meta, StoryObj } from "@storybook/nextjs";
import SignUpContainer from "./SignUpContainer";
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

const meta: Meta<typeof SignUpContainer> = {
  title: "페이지/회원가입 페이지/SignUpContainer",
  component: SignUpContainer,
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
          privacyPolicyAgreed: false,
          marketingConsent: false,
          termsOfServiceAgreed: false,
          contentPolicyAgreed: false,
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
type Story = StoryObj<typeof SignUpContainer>;

export const Default: Story = {};
