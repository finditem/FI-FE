"use client";
"use no memo";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { useGetUsersMe, usePostChangePassword } from "@/api/fetch/user";

export const usePasswordSubmit = () => {
  const router = useRouter();

  const { data: userData } = useGetUsersMe();
  const { mutateAsync, isPending } = usePostChangePassword();

  const {
    watch,
    formState: { errors },
  } = useFormContext();

  const [newPassword, newPasswordConfirm] = watch(["newPassword", "newPasswordConfirm"]);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    await mutateAsync({ newPassword, newPasswordConfirm });

    if (userData?.result?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/mypage");
    }
  };

  const buttonDisabled =
    isPending ||
    !!errors.newPassword ||
    !newPassword ||
    !newPasswordConfirm ||
    newPassword !== newPasswordConfirm;

  return {
    handlePasswordChange,
    buttonDisabled,
  };
};
