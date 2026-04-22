import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminProfile from "./AdminProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const meta: Meta<typeof AdminProfile> = {
  title: "관리자 페이지/메인 페이지/AdminProfile",
  component: AdminProfile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "관리자 프로필 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-[390px] border">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminProfile>;

export const Default: Story = {};
