"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button, InputText } from "@/components";
import { cn } from "@/utils";
import Link from "next/link";
import { useFindPwSubmit } from "@/hooks";
import { ApiFindPwType } from "@/api/fetch/auth";

const FindPwForm = () => {
  const t = useTranslations("FindPwForm");
  const { handleSubmit } = useFormContext<ApiFindPwType>();
  const { onSubmitFindPassword, email, isPending } = useFindPwSubmit();

  return (
    <form
      className={cn(
        "flex w-full flex-col gap-[10px] px-5 py-[64px] h-base tablet:px-20",
        email && "px-9"
      )}
      noValidate
      onSubmit={handleSubmit(onSubmitFindPassword)}
    >
      {!email ? (
        <div className="w-full tablet:px-4">
          <InputText
            label={t("label")}
            inputOption={{
              name: "email",
              type: "email",
              placeholder: t("placeholder"),
              maxLength: 254,
              validation: {
                required: t("required"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("invalidEmail"),
                },
              },
            }}
            btnOption={{
              btnLabel: t("submitBtnLabel"),
              btnType: "submit",
              className: "min-w-[127px]",
              loading: isPending,
            }}
          />
        </div>
      ) : (
        <>
          <p className="py-[18.5px] text-center text-body2-regular">
            {t.rich("sentMessage", {
              email,
              highlight: (chunks) => (
                <span className="inline-block max-w-[200px] truncate text-flatGreen-500">
                  {chunks}
                </span>
              ),
              br: () => <br />,
            })}
          </p>
          <Button as={Link} href="/login/email" className="w-full" ariaLabel={t("loginAriaLabel")}>
            {t("changePassword")}
          </Button>
        </>
      )}
    </form>
  );
};

export default FindPwForm;
