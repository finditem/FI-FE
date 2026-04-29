import type { Meta, StoryObj } from "@storybook/nextjs";
import TermsAgreement from "./TermsAgreement";
import { FormProvider, useForm } from "react-hook-form";

const meta: Meta<typeof TermsAgreement> = {
  title: "공통/domain/TermsAgreement",
  component: TermsAgreement,
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
          selectAll: false,
          over14Age: false,
          privacyPolicyAgreed: false,
          termsOfServiceAgreed: false,
          marketingConsent: false,
          contentPolicyAgreed: false,
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
  args: {
    onOpenDetail: (termKey: string) => console.log("약관 상세 열기:", termKey),
    onComplete: () => console.log("가입 완료"),
  },
};

export default meta;
type Story = StoryObj<typeof TermsAgreement>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};
