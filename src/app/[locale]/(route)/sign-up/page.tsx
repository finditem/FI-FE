"use client";
"use no memo";

import { FormProvider, useForm } from "react-hook-form";
import { FormType } from "./types/FormType";
import SignUpContainer from "./_components/SignUpContainer/SignUpContainer";
import { Suspense } from "react";

const Page = () => {
  const methods = useForm<FormType>({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false, // 입력 값 유지
  });

  return (
    <div className="flex w-full flex-col h-base">
      <Suspense fallback="">
        <FormProvider {...methods}>
          <SignUpContainer />
        </FormProvider>
      </Suspense>
    </div>
  );
};

export default Page;
