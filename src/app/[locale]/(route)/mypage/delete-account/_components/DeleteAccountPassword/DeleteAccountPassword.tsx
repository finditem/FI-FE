"use client";
"use no memo";

import { usePostVerifyPassword } from "@/api/fetch/user";
import { InputText, FooterButton } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import DeleteAccountModal from "../DeleteAccountModal/DeleteAccountModal";
import { useTranslations } from "next-intl";

const DeleteAccountPassword = ({ onBack }: { onBack: () => void }) => {
  const t = useTranslations("DeleteAccountPassword");
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();
  const { getValues, watch, setError } = useFormContext();
  const { mutate: VerifyPasswordMutate, isPending } = usePostVerifyPassword();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleToClick = () => {
    const currentPassword = getValues("passwordConfirm");
    VerifyPasswordMutate(
      { currentPassword },
      {
        onSuccess: () => {
          setModalOpen(true);
        },
        onError: (error) => {
          const errorCode = error.response?.data.code;

          if (errorCode === "USER400-PASSWORD_INCORRECT") {
            setError("passwordConfirm", {
              message: t("passwordMismatchField"),
            });
            addToast(t("passwordMismatchToast"), "warning");
          } else if (errorCode === "USER404-NOT_FOUND") {
            setError("passwordConfirm", {
              message: t("userNotFoundField"),
            });
            addToast(t("userNotFoundToast"), "warning");
          }
        },
      }
    );
  };

  const passwordValue = watch("passwordConfirm")?.trim() || "";

  return (
    <>
      <div className="flex w-full flex-col gap-[18px] px-5 py-[30px] h-hf-base tablet:px-[80px]">
        <h3 className="text-h3-semibold text-[#171717]">{t("title")}</h3>

        <InputText
          inputOption={{
            name: "passwordConfirm",
            type: "password",
            placeholder: t("placeholder"),
            onKeyDown: (e) => {
              if (e.key === " ") e.preventDefault();
            },
          }}
        />
      </div>

      <FooterButton onClick={handleToClick} disabled={passwordValue.length === 0 || isPending}>
        {t("deleteButton")}
      </FooterButton>

      {modalOpen && (
        <DeleteAccountModal modalOpen={modalOpen} setModalOpen={setModalOpen} onBack={onBack} />
      )}
    </>
  );
};

export default DeleteAccountPassword;
