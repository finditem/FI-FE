import type { Meta, StoryObj } from "@storybook/nextjs";
import DeleteAccountReason from "./DeleteAccountReason";
import { FormProvider, useForm } from "react-hook-form";

const meta: Meta<typeof DeleteAccountReason> = {
  title: "페이지/마이페이지/회원 탈퇴 페이지/DeleteAccountReason",
  component: DeleteAccountReason,
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
        },
      });
      return (
        <FormProvider {...methods}>
          <div className="w-[390px]">
            <Story />
          </div>
        </FormProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof DeleteAccountReason>;

export const Default: Story = {
  args: {
    onNext: () => {},
    socialUser: false,
  },
};

export const SocialUser: Story = {
  args: {
    onNext: () => {},
    socialUser: true,
  },
};
