"use client";

import { FormProvider, useForm } from "react-hook-form";
import { DetailHeader } from "@/components";
import { ChangePasswordForm } from "./_components";

interface ChangePasswordFormType {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const page = () => {
  const methods = useForm<ChangePasswordFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <>
      <DetailHeader title="비밀번호 변경" />
      <h1 className="sr-only">비밀번호 변경 페이지</h1>

      <section className="flex flex-col h-base">
        <FormProvider {...methods}>
          <ChangePasswordForm />
        </FormProvider>
      </section>
    </>
  );
};

export default page;
