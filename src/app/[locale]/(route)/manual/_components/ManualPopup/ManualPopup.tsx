"use client";

import { useTranslations } from "next-intl";
import { Button, Icon, PopupLayout } from "@/components";
import Link from "next/link";

interface ManualPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualPopup = ({ isOpen, onClose }: ManualPopupProps) => {
  const t = useTranslations("ManualPopup");

  return (
    <PopupLayout isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto mb-6 mt-[71px] h-[74px] w-[74px] rounded-full">
        <Icon name="Book" size={74} />
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-h3-semibold text-[#171717]">
          {t("titleLine1")} <br />
          {t("titleLine2")}
        </h1>
        <p className="text-body2-medium text-[#7D7D7D]">
          {t("descLine1")} <br /> {t("descLine2")}
        </p>
      </div>

      <div className="my-10 flex flex-col gap-3">
        <Button
          className="h-[48px] w-full rounded-[12px] text-body1-semibold text-white bg-fill-brand-normal-default"
          as={Link}
          href="/manual"
        >
          {t("primaryBtn")}
        </Button>
        <Button
          variant="outlined"
          className="h-[64px] w-full border-none text-neutralInversed-strong-default"
          onClick={onClose}
        >
          {t("secondaryBtn")}
        </Button>
      </div>
    </PopupLayout>
  );
};

export default ManualPopup;
