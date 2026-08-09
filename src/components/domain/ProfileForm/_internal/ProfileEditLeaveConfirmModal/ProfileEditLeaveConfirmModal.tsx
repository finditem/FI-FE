"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";
import Link from "next/link";

interface ProfileEditLeaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditLeaveConfirmModal = ({ isOpen, onClose }: ProfileEditLeaveConfirmModalProps) => {
  const t = useTranslations("ProfileEditLeaveConfirmModal");

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[300px] gap-6 p-6 flex-col-center"
    >
      <div className="gap-1 flex-col-center">
        <h3 className="text-h3-semibold text-layout-header-default">{t("title")}</h3>
        <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="w-full" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button className="w-full" as={Link} href="/mypage">
          {t("leave")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default ProfileEditLeaveConfirmModal;
