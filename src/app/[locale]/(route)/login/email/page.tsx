"use client";
"use no memo";

import { FormProvider, useForm } from "react-hook-form";
import { EmailLoginForm } from "./_components";
import { LoginFormType } from "./_types/LoginFormType";
import { DetailHeader } from "@/components";

const page = () => {
  const methods = useForm<LoginFormType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  return (
    <>
      <DetailHeader title="이메일 로그인" />
      <h1 className="sr-only">이메일 로그인 페이지</h1>

      <FormProvider {...methods}>
        <EmailLoginForm />
      </FormProvider>
    </>
  );
};

export default page;
