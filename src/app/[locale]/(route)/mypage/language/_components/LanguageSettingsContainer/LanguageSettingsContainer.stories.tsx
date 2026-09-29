import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LanguageSettingsContainer from "./LanguageSettingsContainer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const meta: Meta<typeof LanguageSettingsContainer> = {
  title: "페이지/마이페이지/언어 설정 페이지/LanguageSettingsContainer",
  component: LanguageSettingsContainer,
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
        <div className="flex min-h-[400px] w-[390px] flex-col border border-gray-200">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageSettingsContainer>;

export const Default: Story = {};
