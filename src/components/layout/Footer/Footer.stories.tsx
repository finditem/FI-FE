import { Meta, StoryObj } from "@storybook/nextjs";
import Footer from "./Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const meta = {
  title: "공통 컴포넌트/Footer",
  component: Footer,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <Footer />,
};
