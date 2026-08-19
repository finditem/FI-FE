"use client";

import { useTranslations } from "next-intl";
import { DetailHeader } from "@/components/layout";
import { FooterButton } from "@/components/domain";
import { CheckBox } from "@/components/common";
import { cn } from "@/utils";
import { TERM_CONTENTS } from "./_constants/TERM_CONTENTS";
import { useGetNotificationSetting, usePutNotificationSetting } from "@/api/fetch/notification";
import { DEFAULT_NOTIFICATION_SETTING } from "@/app/[locale]/(route)/mypage/notifications/_constants/DEFAULT_NOTIFICATION_SETTING";
import { useToast } from "@/context/ToastContext";

interface TermsProps {
  termName: string;
  onAgree?: () => void;
  showButton?: boolean;
  pageType?: "SIGN_UP" | "TERM";
}

const Terms = ({ termName, onAgree, showButton = false, pageType = "TERM" }: TermsProps) => {
  const t = useTranslations("Terms");
  const isOptionalTerm = termName === "marketingConsent" || termName === "contentPolicyAgreed";
  const { data: SettingData, isError } = useGetNotificationSetting({
    enabled: isOptionalTerm && pageType === "TERM",
  });
  const { mutate: SettingMutate, isPending } = usePutNotificationSetting();
  const { addToast } = useToast();

  if (isError) addToast(t("loadError"), "warning");

  const term = TERM_CONTENTS[termName as keyof typeof TERM_CONTENTS];

  if (!term) {
    return null;
  }

  const { termHeader, title, content } = term;

  const checkState = SettingData?.result ?? DEFAULT_NOTIFICATION_SETTING;
  const isChecked =
    termName === "marketingConsent" ? checkState.marketingConsent : checkState.contentPolicyAgreed;

  const handleToCheck = (name: string) => {
    const nextSetting = {
      ...checkState,
      [name]: !isChecked,
    };

    SettingMutate(nextSetting);
  };

  return (
    <>
      <DetailHeader title={pageType === "TERM" ? termHeader : title} />
      <div
        className={cn(
          "whitespace-pre-wrap px-4 pt-6 text-body2-regular text-layout-body-default",
          showButton ? "pb-[calc(88px+24px)] h-hfb-base" : "pb-6 h-base"
        )}
      >
        {pageType === "TERM" && isOptionalTerm && (
          <>
            <div className="flex h-11 w-full items-center">
              <CheckBox
                id={termName}
                checked={isChecked}
                label={title}
                onChange={() => handleToCheck(termName)}
                disabled={isPending}
              />
            </div>
            <hr className="my-5 max-w-full border border-divider-default_3" />
          </>
        )}
        <div>{content}</div>
      </div>

      {showButton && <FooterButton onClick={onAgree}>{t("agree")}</FooterButton>}
    </>
  );
};

export default Terms;
