"use client";

import { useTranslations } from "next-intl";
import { ErrorView } from "@/components";

const NotFoundView = () => {
  const t = useTranslations("NotFound");

  return (
    <ErrorView
      iconName="NotFound"
      code="404"
      title={t("title")}
      description={
        <>
          {t("descriptionLine1")} <br />
          {t("descriptionLine2")}
        </>
      }
    />
  );
};

export default NotFoundView;
