"use client";
"use no memo";

import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { EmailLoginForm } from "./_components";
import { LoginFormType } from "./_types/LoginFormType";
import { DetailHeader } from "@/components";

const page = () => {
  const t = useTranslations("EmailLoginPage");
  const methods = useForm<LoginFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srHeading")}</h1>

      <FormProvider {...methods}>
        <EmailLoginForm />
      </FormProvider>
    </>
  );
};

export default page;
