"use client";
"use no memo";

import { ApiFindPwType } from "@/api/fetch/auth";
import { DetailHeader } from "@/components/layout";
import { FormProvider, useForm } from "react-hook-form";
import { FindPwForm } from "./_components";

const Page = () => {
  const methods = useForm<ApiFindPwType>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false, // 입력 값 유지
  });

  return (
    <FormProvider {...methods}>
      <DetailHeader title="비밀번호 찾기 페이지" />
      <FindPwForm />
    </FormProvider>
  );
};

export default Page;
