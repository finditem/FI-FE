import type { Meta, StoryObj } from "@storybook/nextjs";
import Terms from "./Terms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof Terms> = {
  title: "공통/domain/Terms",
  component: Terms,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-[390px]">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Terms>;

export const PrivacyPolicy: Story = {
  args: {
    termName: "privacyPolicyAgreed",
  },
};

export const TermsOfService: Story = {
  args: {
    termName: "termsOfServiceAgreed",
  },
};

export const MarketingConsent: Story = {
  args: {
    termName: "marketingConsent",
    pageType: "TERM",
  },
};

export const WithButton: Story = {
  args: {
    termName: "privacyPolicyAgreed",
    showButton: true,
    pageType: "SIGN_UP",
  },
};
