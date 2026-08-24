"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";

interface HeaderDeleteProps {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
  disabled?: boolean;
}

const HeaderDelete = ({ isDeleteMode, setIsDeleteMode, disabled = false }: HeaderDeleteProps) => {
  const t = useTranslations("DetailHeader");

  return (
    <button
      type="button"
      aria-label={isDeleteMode ? t("deleteCancelAriaLabel") : t("deleteEnterAriaLabel")}
      onClick={() => setIsDeleteMode(!isDeleteMode)}
      disabled={disabled}
      className="disabled:cursor-not-allowed disabled:opacity-40"
    >
      {!isDeleteMode ? (
        <Icon name="Trash" size={24} className="text-neutral-normal-default" />
      ) : (
        <span className="text-h3-medium text-layout-header-default">{t("cancelLabel")}</span>
      )}
    </button>
  );
};

export default HeaderDelete;
