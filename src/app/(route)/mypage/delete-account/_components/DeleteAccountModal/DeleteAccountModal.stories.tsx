import type { Meta, StoryObj } from "@storybook/nextjs";
import DeleteAccountModal from "./DeleteAccountModal";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

const meta: Meta<typeof DeleteAccountModal> = {
  title: "페이지/마이페이지/회원 탈퇴 페이지/DeleteAccountModal",
  component: DeleteAccountModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteAccountModal>;

export const Open: Story = {
  render: () => {
    const methods = useForm();
    const [modalOpen, setModalOpen] = useState(true);

    return (
      <FormProvider {...methods}>
        <DeleteAccountModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onBack={() => setModalOpen(false)}
        />
      </FormProvider>
    );
  },
};

export const Closed: Story = {
  render: () => {
    const methods = useForm();
    const [modalOpen, setModalOpen] = useState(false);

    return (
      <FormProvider {...methods}>
        <DeleteAccountModal modalOpen={modalOpen} setModalOpen={setModalOpen} onBack={() => {}} />
      </FormProvider>
    );
  },
};
