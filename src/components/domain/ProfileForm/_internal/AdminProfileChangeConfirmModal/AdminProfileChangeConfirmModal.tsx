"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

interface AdminProfileChangeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AdminProfileChangeConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: AdminProfileChangeConfirmModalProps) => {
  const t = useTranslations("AdminProfileChangeConfirmModal");

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="space-y-6 rounded-[8px] p-6">
      <div className="flex min-w-[300px] flex-col gap-1 text-center">
        <h2 className="text-h3-semibold text-layout-header-default">{t("title")}</h2>
        <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <Button variant="outlined" className="min-h-11 flex-1" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button className="min-h-11 flex-1" onClick={onConfirm}>
          {t("confirm")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default AdminProfileChangeConfirmModal;
