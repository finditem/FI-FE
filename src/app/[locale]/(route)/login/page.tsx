"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { Button, Icon } from "@/components";
import useSessionNotification from "./_hooks/useSessionNotification";
import { LogoLink } from "./_components";
import { useSearchParams } from "next/navigation";
import { createOAuthState } from "@/utils";
import {
  trackClickAppleLogin,
  trackClickSignupStart,
  trackClickKakaoLogin,
  trackClickLoginButton,
} from "@/utils/analytics/analytics";

const ButtonStyle = "w-full h-11 flex-center gap-1 rounded-[10px] text-body1-semibold ";

const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const kakaoBaseUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;
const appleBaseUrl = `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code`;

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

  const handleSocialLogin = (provider: "kakao" | "apple") => {
    if (provider === "kakao") trackClickKakaoLogin();
    else trackClickAppleLogin();

    if (callbackUrl) sessionStorage.setItem("callbackUrl", callbackUrl);
    else sessionStorage.removeItem("callbackUrl");

    const state = createOAuthState();
    const baseUrl = provider === "kakao" ? kakaoBaseUrl : appleBaseUrl;
    window.location.replace(`${baseUrl}&state=${state}`);
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
          onClick={() => handleSocialLogin("kakao")}
          className={cn(
            ButtonStyle,
            "gap-1 text-flatGray-900 bg-fill-accent-kakao hover:bg-fill-accent-kakao"
          )}
        >
          <Icon name="KakaoLogin" size={20} />
          {t("kakaoButton")}
        </Button>
        <Button
          type="submit"
          ignoreBase
          ariaLabel={t("appleAriaLabel")}
          onClick={() => handleSocialLogin("apple")}
          className={cn(
            ButtonStyle,
            "gap-1 bg-labelsVibrant-primary text-white hover:bg-labelsVibrant-primary"
          )}
        >
          <Icon name="AppleLogin" size={20} />
          {t("appleButton")}
        </Button>
      </div>

      {/* divider 구분선 */}
      <div className="flex h-[18px] w-full items-center px-5 tablet:px-[96px]">
        <hr className="h-px flex-1 bg-flatGray-50" aria-hidden={true} />
        <span className="px-3 text-caption1-medium text-layout-body-default">{t("divider")}</span>
        <hr className="h-px flex-1 bg-flatGray-50" aria-hidden={true} />
      </div>

      {/* 이메일 로그인 및 회원가입 */}
      <div className="h-11 gap-1.5 flex-center">
        <Link
          href={emailLoginHref}
          replace
          aria-label={t("emailAriaLabel")}
          onClick={() => trackClickLoginButton("login_email_select")}
          className="min-w-[128px] p-3 text-right text-caption1-semibold text-neutral-normal-default"
        >
          {t("emailButton")}
        </Link>

        <div className="h-4 w-px bg-flatGray-50" aria-hidden={true} />

        <Link
          href="/sign-up"
          onClick={trackClickSignupStart}
          className={cn("min-w-[128px] p-3 text-caption1-semibold text-brand-normal-default")}
        >
          {t("createAccount")}
        </Link>
      </div>
    </div>
  );
};

export default page;
