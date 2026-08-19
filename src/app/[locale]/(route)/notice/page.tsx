"use client";

import { DetailHeader, FloatingButton, ScrollToTopButton, ErrorState } from "@/components";
import { NoticeFilter, NoticeSearchForm, NoticeView, NoticeListErrorButtons } from "./_components";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSearchUpdateQueryString } from "@/hooks";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { useGetUsersMe } from "@/api/fetch/user";
import { useTranslations } from "next-intl";

const NoticePageContent = () => {
  const t = useTranslations("NoticePage");
  const { searchUpdateQuery } = useSearchUpdateQueryString("replace");

  return (
    <>
      <NoticeSearchForm />
      <NoticeFilter searchUpdateQuery={searchUpdateQuery} />

      <ErrorBoundary
        fallback={
          <ErrorState
            icon={{ iconName: "NoReports", iconSize: 70 }}
            title={t("error.title")}
            description={t("error.description")}
          >
            <NoticeListErrorButtons />
          </ErrorState>
        }
      >
        <NoticeView />
      </ErrorBoundary>
    </>
  );
};

const Notice = () => {
  const t = useTranslations("NoticePage");
  const router = useRouter();
  const { data: userData } = useGetUsersMe();
  const isAdmin = userData?.result?.role === "ADMIN";

  return (
    <div className="min-h-dvh">
      <DetailHeader title={t("title")} />
      <h1 className="sr-only">{t("heading")}</h1>
      <Suspense fallback="">
        <NoticePageContent />
      </Suspense>

      <div className="fixed bottom-[30px] right-6 space-y-2">
        <ScrollToTopButton />
        {isAdmin && (
          <FloatingButton
            ariaLabel={t("writeAriaLabel")}
            mode="notice"
            onClick={() => router.push("/admin/notice/write")}
          />
        )}
      </div>
    </div>
  );
};

export default Notice;
