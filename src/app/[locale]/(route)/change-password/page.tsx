"use client";

import { FormProvider, useForm } from "react-hook-form";
import { DetailHeader } from "@/components";
import { ChangePasswordForm } from "./_components";
import { useTranslations } from "next-intl";

interface ChangePasswordFormType {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const page = () => {
  const t = useTranslations("ChangePassword");
  const methods = useForm<ChangePasswordFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("heading")}</h1>

      <section className="flex flex-col h-base">
        <FormProvider {...methods}>
          <ChangePasswordForm />
        </FormProvider>
      </section>
    </>
  );
};

export default page;
