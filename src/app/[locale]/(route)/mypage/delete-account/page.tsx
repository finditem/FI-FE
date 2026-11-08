"use client";

import { DetailHeader } from "@/components";
import { DeleteAccountContainer, DeleteComplete } from "./_components";
import { Suspense, useState } from "react";
import { DeleteAccountType, useDeleteAccount } from "@/api/fetch/user";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("DeleteAccountPage");
  const methods = useForm<DeleteAccountType>({ mode: "onChange", reValidateMode: "onChange" });
  const { addToast } = useToast();

  const [isDeleted, setIsDeleted] = useState(false);
  const { mutate: DeleteAccountMutate, isPending } = useDeleteAccount();
  const queryClient = useQueryClient();

  const onSubmit = (data: DeleteAccountType) => {
    if (isPending) return;

    const payload: DeleteAccountType = {
      reasons: data.reasons,
    };

    if (data.reasons?.includes("OTHER") && data.otherReason && data.otherReason.trim() !== "") {
      payload.otherReason = data.otherReason;
    }

    DeleteAccountMutate(payload, {
      onSuccess: () => {
        setIsDeleted(true);
        queryClient.clear();
      },
      onError: (error) => {
        if (error.code === "USER404-NOT_FOUND") addToast(t("userNotFound"), "warning");
        else if (error.code === "FILE500-DELETE_IO") addToast(t("deleteFailed"), "warning");
      },
    });
  };

  if (isDeleted) {
    return <DeleteComplete />;
  }

  return (
    <>
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("srOnlyTitle")}</h1>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <Suspense fallback="">
            <DeleteAccountContainer />
          </Suspense>
        </form>
      </FormProvider>
    </>
  );
};

export default page;
