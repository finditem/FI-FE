"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { executeShare } from "@/utils";
import { Button } from "@/components/common";
import { PopupLayout } from "@/components/domain";
import { SHARE } from "./SHARE";
import { ShareId } from "@/types";
import { useToast } from "@/context/ToastContext";
import { MetaDataItemWithLink, ObjectType } from "@/types/MetaDataType";

interface ContentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  metaData: MetaDataItemWithLink;
  objectType: ObjectType;
}

const SHARE_LABEL_KEY: Record<ShareId, string> = {
  kakao: "kakaoLabel",
  native: "nativeLabel",
  copy: "copyLabel",
};

const ContentShareModal = ({ isOpen, onClose, metaData, objectType }: ContentShareModalProps) => {
  const t = useTranslations("ContentShareModal");
  const { addToast } = useToast();

  const handleOption = (id: ShareId) =>
    executeShare({
      id,
      metaData,
      objectType,
      addToast,
      copyMessages: { success: t("copySuccess"), error: t("copyError") },
      kakaoWebViewButtonLabel: t("kakaoWebViewButton"),
    });

  return (
    <PopupLayout isOpen={isOpen} onClose={onClose} className="min-h-[305px] space-y-12 px-5 py-10">
      <section className="gap-5 flex-col-center">
        <h2 className="text-h3-semibold text-layout-header-default">{t("title")}</h2>
        <div className="w-full gap-[18px] flex-center">
          {SHARE.map((item) => (
            <ShareOptionButton
              key={item.id}
              src={item.src}
              name={t(SHARE_LABEL_KEY[item.id])}
              onClick={() => handleOption(item.id)}
            />
          ))}
        </div>
      </section>

      <Button
        aria-label={t("close")}
        onClick={onClose}
        variant="outlined"
        className="min-h-11 w-full"
      >
        {t("close")}
      </Button>
    </PopupLayout>
  );
};

export default ContentShareModal;

const ShareOptionButton = ({
  src,
  name,
  onClick,
}: {
  src: string;
  name: string;
  onClick: () => void;
}) => {
  return (
    <button
      aria-label={name}
      type="button"
      className="select-none gap-2 flex-col-center"
      onClick={onClick}
    >
      <Image
        src={src}
        alt=""
        width={60}
        height={60}
        draggable={false}
        priority
        className="rounded-full"
      />
      <span className="text-body2-semibold text-neutral-normal-default">{name}</span>
    </button>
  );
};
