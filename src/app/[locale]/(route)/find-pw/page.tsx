"use client";
"use no memo";

import { ApiFindPwType } from "@/api/fetch/auth";
import { DetailHeader } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FindPwForm } from "./_components";

const Page = () => {
  const t = useTranslations("FindPwPage");
  const methods = useForm<ApiFindPwType>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false, // 입력 값 유지
  });

  return (
    <FormProvider {...methods}>
      <DetailHeader title={t("title")} />
      <FindPwForm />
    </FormProvider>
  );
};

export default Page;
