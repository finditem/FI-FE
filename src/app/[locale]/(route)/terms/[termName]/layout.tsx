import type { Metadata } from "next";
import { ReactNode } from "react";
import { TERM_CONTENTS } from "@/components/domain/Terms/_constants/TERM_CONTENTS";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string; termName: string }>;
}

const TERM_HEADER_BY_ROUTE_PARAM: Record<string, string> = {
  privacy: TERM_CONTENTS.privacyPolicyAgreed.termHeader,
  service: TERM_CONTENTS.termsOfServiceAgreed.termHeader,
  marketing: TERM_CONTENTS.marketingConsent.termHeader,
  contentPolicy: TERM_CONTENTS.contentPolicyAgreed.termHeader,
};

export async function generateMetadata({
  params,
}: {
  params: LayoutProps["params"];
}): Promise<Metadata> {
  const { locale, termName } = await params;
  const termHeader = TERM_HEADER_BY_ROUTE_PARAM[termName] ?? "이용 약관";

  return {
    title: termHeader,
    description: `찾아줘 서비스의 ${termHeader} 내용을 확인해 보세요.`,
    // 약관 본문이 한국어만 있어 영어 경로는 번역 전까지 색인에서 제외한다.
    ...(locale !== "ko" && { robots: { index: false } }),
    other: { "page-type": "terms" },
  };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { termName } = await params;
  const termHeader = TERM_HEADER_BY_ROUTE_PARAM[termName];

  return (
    <>
      {/* 약관 화면의 보이는 제목은 공통 헤더의 h2라, 문서 제목 역할을 하는 h1을 따로 둔다. */}
      {termHeader && <h1 className="sr-only">{termHeader}</h1>}
      {children}
    </>
  );
}
