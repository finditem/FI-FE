import { InquiryWriteFormValues } from "../../_types/InquiryWriteFormValues";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { InquiryInput, InquiryCategoryButton, InquiryTextarea } from "./_internal";
import { WriteImageSection } from "@/components";
import { useEffect } from "react";

interface InquiryWriteFormProps {
  methods: UseFormReturn<InquiryWriteFormValues>;
  onSubmit: (data: InquiryWriteFormValues) => void;
  userEmail: string;
  isUserSuccess: boolean;
}

const InquiryWriteForm = ({
  methods,
  onSubmit,
  userEmail,
  isUserSuccess,
}: InquiryWriteFormProps) => {
  useEffect(() => {
    if (!isUserSuccess || !userEmail) return;

    const currentEmail = methods.getValues("email");
    if (currentEmail) return;

    methods.setValue("email", userEmail, { shouldValidate: true, shouldDirty: true });
  }, [userEmail, isUserSuccess, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-3 pt-5">
        <InquiryInput name="title" placeholder="문의 제목을 입력해 주세요." maxLength={50} />
        <InquiryInput
          name="email"
          type="email"
          placeholder="이메일을 입력해주세요."
          disabled={!!userEmail}
        />
        <InquiryCategoryButton />
        <InquiryTextarea name="content" maxLength={500} />
        <div className="flex-1 border-b border-labelsVibrant-quaternary" />
        <WriteImageSection />
      </form>
    </FormProvider>
  );
};

export default InquiryWriteForm;
