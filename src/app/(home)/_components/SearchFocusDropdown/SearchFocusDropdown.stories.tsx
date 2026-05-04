import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/providers/ToastProviders";
import SearchFocusDropdown from "./SearchFocusDropdown";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof SearchFocusDropdown> = {
  title: "페이지/메인/SearchFocusDropdown",
  component: SearchFocusDropdown,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-[420px] w-full max-w-[430px] bg-white px-5">
            <Story />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchFocusDropdown>;

const FocusedTemplate = (args: { searchKeyword: string }) => {
  const [, setFocused] = useState(true);
  return <SearchFocusDropdown focused setFocused={setFocused} searchKeyword={args.searchKeyword} />;
};

export const OpenEmptyKeyword: Story = {
  render: FocusedTemplate,
  args: {
    searchKeyword: "",
  },
};

export const OpenWithKeyword: Story = {
  render: FocusedTemplate,
  args: {
    searchKeyword: "테헤란로",
  },
};
