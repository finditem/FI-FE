"use client";

import { Button } from "@/components";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";

const NoticeListErrorButtons = () => {
  const t = useTranslations("NoticePage.error");
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outlined"
        size="big"
        ignoreBase
        className="h-11 w-24 rounded-[10px] border border-brand-normal-default text-body1-semibold text-brand-normal-default flex-center"
        onClick={() => queryClient.refetchQueries({ queryKey: ["notices"] })}
      >
        {t("refresh")}
      </Button>
      <Button variant="outlined" size="big" as={Link} href="/inquiry-write">
        {t("inquiry")}
      </Button>
    </div>
  );
};

export default NoticeListErrorButtons;
