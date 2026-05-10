"use client";

import { useForm } from "react-hook-form";
import { InquiryWriteFormValues } from "./_types/InquiryWriteFormValues";
import { InquiryWriteDetailHeader, InquiryWriteForm } from "./_components";
import { useInquiryWrite } from "./_hooks";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const canSubmit = (values: InquiryWriteFormValues): boolean => {
  const isValidEmail = EMAIL_REGEX.test(values.email?.trim() ?? "");

  return Boolean(
    values.title?.trim() && isValidEmail && values.inquiryType && values.content?.trim()
  );
};

const page = () => {
  const { onSubmit, isInquiryPending, userEmail, isUserSuccess } = useInquiryWrite();
  const methods = useForm<InquiryWriteFormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const values = methods.watch();
  const isPostDisabled = !canSubmit(values);
  const isDisabled = isPostDisabled || isInquiryPending;

  return (
    <div className="flex h-dvh flex-col">
      <InquiryWriteDetailHeader isDisabled={isDisabled} onSubmit={methods.handleSubmit(onSubmit)} />

      <InquiryWriteForm
        methods={methods}
        onSubmit={onSubmit}
        userEmail={userEmail}
        isUserSuccess={isUserSuccess}
      />
    </div>
  );
};

export default page;
