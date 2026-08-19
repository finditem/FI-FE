import type { Metadata } from "next";
import { ReactNode } from "react";
import { TERM_CONTENTS } from "@/components/domain/Terms/_constants/TERM_CONTENTS";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ termName: string }>;
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
  const { termName } = await params;
  const termHeader = TERM_HEADER_BY_ROUTE_PARAM[termName] ?? "이용 약관";

  return {
    title: termHeader,
    description: `찾아줘 서비스의 ${termHeader} 내용을 확인해 보세요.`,
    other: { "page-type": "terms" },
  };
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
