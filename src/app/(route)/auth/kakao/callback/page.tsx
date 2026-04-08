"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiKakaoLogin } from "@/api/fetch/auth";
import { Icon } from "@/components/common";

const KakaoCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const isRequesting = useRef(false);

  const { mutate: KakaoLoginMutate } = useApiKakaoLogin();

  const appEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";

  useEffect(() => {
    if (!code) return;
    if (isRequesting.current) return;

    isRequesting.current = true;

    KakaoLoginMutate({
      code: code,
      environment: appEnv,
    });
  }, [code, KakaoLoginMutate, router]);

  return (
    <div className="flex min-h-screen w-full flex-col-center">
      <div className="flex flex-col items-center gap-4">
        <Icon name="Loading" className="animate-spin" size={40} />
        <p className="text-body1-regular text-gray-700">로그인 요청 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallbackPage;
