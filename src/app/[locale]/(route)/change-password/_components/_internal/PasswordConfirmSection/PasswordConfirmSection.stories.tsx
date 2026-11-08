import type { Meta, StoryObj } from "@storybook/nextjs";
import PasswordConfirmSection from "./PasswordConfirmSection";
import { FormProvider, useForm } from "react-hook-form";

const meta: Meta<typeof PasswordConfirmSection> = {
  title: "페이지/비밀번호 변경 페이지/PasswordConfirmSection",
  component: PasswordConfirmSection,
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
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        },
      });
      return (
        <FormProvider {...methods}>
          <div className="w-[390px] px-5">
            <Story />
          </div>
        </FormProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof PasswordConfirmSection>;

export const Default: Story = {};
