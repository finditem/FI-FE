import type { Meta, StoryObj } from "@storybook/nextjs";
import { useForm, FormProvider } from "react-hook-form";
import InputChat from "./InputChat";

const meta: Meta<typeof InputChat> = {
  title: "페이지/채팅 상세 페이지/InputChat",
  component: InputChat,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    roomId: {
      control: "number",
      description: "채팅방 ID",
    },
    userId: {
      control: "number",
      description: "사용자 ID",
    },
  },
  decorators: [
    (Story) => {
      const methods = useForm();

      return (
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()} className="w-[480px]">
            <Story />
          </form>
        </FormProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "content",
    roomId: 1,
    userId: 1,
  },
};
