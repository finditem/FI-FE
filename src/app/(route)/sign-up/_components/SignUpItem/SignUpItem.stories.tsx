import type { Meta, StoryObj } from "@storybook/nextjs";
import SignUpItem from "./SignUpItem";
import { FormProvider, useForm } from "react-hook-form";

const meta: Meta<typeof SignUpItem> = {
  title: "페이지/회원가입 페이지/SignUpItem",
  component: SignUpItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <div className="w-[390px] px-4">
            <Story />
          </div>
        </FormProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SignUpItem>;

export const Email: Story = {
  args: {
    inputOption: {
      name: "email",
      type: "text",
      placeholder: "이메일을 입력해 주세요.",
    },
    label: "아이디(이메일)",
    btnOption: { btnLabel: "인증번호 발송" },
    isVerified: false,
  },
};

export const EmailVerified: Story = {
  args: {
    inputOption: {
      name: "email",
      type: "text",
      placeholder: "이메일을 입력해 주세요.",
    },
    label: "아이디(이메일)",
    btnOption: { btnLabel: "인증번호 발송" },
    isVerified: true,
  },
};

export const Password: Story = {
  args: {
    inputOption: {
      name: "password",
      type: "password",
      placeholder: "비밀번호를 입력해 주세요.",
    },
    label: "비밀번호",
    btnOption: {},
    caption: { rule: "8~16자리, 대문자/소문자/숫자/특수 문자 포함" },
    isVerified: false,
  },
};

export const Nickname: Story = {
  args: {
    inputOption: {
      name: "nickname",
      type: "text",
      placeholder: "닉네임을 입력해 주세요.",
    },
    label: "닉네임",
    btnOption: { btnLabel: "중복확인" },
    isVerified: false,
  },
};
