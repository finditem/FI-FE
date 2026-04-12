"use client";

import { DetailHeader } from "@/components/layout";
import { DeleteAccountContainer, DeleteComplete } from "./_components";
import { Suspense, useState } from "react";
import { DeleteAccountType, useDeleteAccount } from "@/api/fetch/user";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";

const page = () => {
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
        if (error.code === "USER404-NOT_FOUND") addToast("존재하지 않는 회원이에요", "warning");
        else if (error.code === "FILE500-DELETE_IO") addToast("회원 탈퇴에 실패했어요", "warning");
      },
    });
  };

  if (isDeleted) {
    return <DeleteComplete />;
  }

  return (
    <>
      <DetailHeader title="회원 탈퇴" />
      <h1 className="sr-only">회원탈퇴 페이지</h1>

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
