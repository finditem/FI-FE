import { Meta, StoryObj } from "@storybook/nextjs";
import ErrorSimilarSection from "./ErrorSimilarSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const meta: Meta<typeof ErrorSimilarSection> = {
  title: "페이지/상세 페이지/ErrorSimilarSection",
  component: ErrorSimilarSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <div className="w-[390px] border">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
