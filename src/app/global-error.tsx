"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorView } from "@/components";
import { cn } from "@/utils";
import "@/app/globals.css";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        className={cn("mx-auto max-w-[390px] border-2 flex-col-center", "tablet:max-w-[768px]")}
      >
        <ErrorView
          iconName="ServerError"
          code="500"
          title="서버에 문제가 발생했습니다"
          description={
            <>
              현재 서버에 일시적인 문제가 발생했습니다. <br />
              잠시 후 다시 시도해주세요.
            </>
          }
        />
      </body>
    </html>
  );
}
