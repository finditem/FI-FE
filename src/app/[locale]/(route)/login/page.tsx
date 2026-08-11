"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { Button, Icon } from "@/components";
import useSessionNotification from "./_hooks/useSessionNotification";
import { LogoLink } from "./_components";
import { useSearchParams } from "next/navigation";

const ButtonStyle = "w-full h-11 flex-center gap-1 rounded-[10px] text-body1-semibold ";

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const page = () => {
  const t = useTranslations("Login");
  const { reason } = useSessionNotification();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const emailLoginHref = (() => {
    const params = new URLSearchParams();
    if (reason === "session-expired") params.set("reason", "session-expired");
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    const query = params.toString();
    return query ? `/login/email?${query}` : "/login/email";
  })();

  const handleKakaoLogin = () => {
    if (callbackUrl) sessionStorage.setItem("callbackUrl", callbackUrl);
    else sessionStorage.removeItem("callbackUrl");

    window.location.replace(kakaoURL);
  };

  return (
    <div className="min-h-screen w-full gap-8 flex-col-center">
      <LogoLink />

      {/* button */}
      <div className="flex w-full flex-col gap-4 px-4 tablet:px-[80px]">
        <Button
          type="submit"
          ignoreBase
          ariaLabel={t("kakaoAriaLabel")}
          onClick={handleKakaoLogin}
          className={cn(
            ButtonStyle,
            "gap-1 text-flatGray-900 bg-fill-accent-kakao hover:bg-fill-accent-kakao"
          )}
        >
          <Icon name="KakaoLogin" size={20} />
          {t("kakaoButton")}
        </Button>
        <Button
          as={Link}
          href={emailLoginHref}
          replace
          ignoreBase
          className={cn(ButtonStyle, "gap-2 text-white bg-fill-brand-normal-default")}
          aria-label={t("emailAriaLabel")}
        >
          <Icon name="Mail" size={20} className="text-white" />
          {t("emailButton")}
        </Button>
      </div>

      {/* divider 구분선 */}
      <div className="flex h-[18px] w-full items-center px-5 tablet:px-[96px]">
        <hr className="h-px flex-1 bg-flatGray-50" aria-hidden={true} />
        <span className="px-3 text-caption1-medium text-layout-body-default">{t("divider")}</span>
        <hr className="h-px flex-1 bg-flatGray-50" aria-hidden={true} />
      </div>

      {/* 회원확인 여부 */}
      <div className="h-11">
        <span className="text-caption1-medium text-neutral-normal-placeholder">
          {t("notMemberYet")}
        </span>
        <Link
          href="/sign-up"
          className={cn(
            "Inversed-strong-default p-3 text-caption1-semibold text-brand-normal-default"
          )}
        >
          {t("signUp")}
        </Link>
      </div>
    </div>
  );
};

export default page;
