import { useTranslations } from "next-intl";
import { Button, Icon, PopupLayout } from "@/components";

interface PublicCallBottomSheetData {
  location: string;
  phoneNumber: string;
}

interface PublicCallBottomSheetProps {
  callBottomSheetData: PublicCallBottomSheetData;
  isOpen: boolean;
  onClose: () => void;
}

const formattedPhone = (phoneNumber: string) => phoneNumber.replace(/[^0-9]/g, "");

const PublicCallBottomSheet = ({
  callBottomSheetData,
  isOpen,
  onClose,
}: PublicCallBottomSheetProps) => {
  const t = useTranslations("PublicCallBottomSheet");
  const { location, phoneNumber } = callBottomSheetData;

  return (
    <PopupLayout isOpen={isOpen} onClose={onClose} className="!bg-transparent mb-10 px-5">
      <div className="gap-2 rounded-[24px] bg-white px-5 py-7 flex-col-center">
        <div className="flex w-full flex-col gap-7">
          <div className="space-y-[32px] text-center">
            <h2 className="text-h2-bold text-layout-header-default">{t("title")}</h2>

            <div className="mx-auto flex min-h-[82px] min-w-[227px] max-w-full items-start justify-center gap-3 rounded-[16px] px-[18px] py-4 bg-fill-brand-subtle-default_2">
              <div className="size-10 shrink-0 rounded-[10px] bg-fill-brand-subtle-hover flex-center">
                <Icon name="Phone" size={20} />
              </div>
              <div className="flex flex-col gap-1 text-start">
                <h3 className="text-body1-semibold text-layout-header-default">{location}</h3>
                <p className="text-h2-bold text-brand-strongUseThis-default">{phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon
              name="MessageAlertCircle"
              size={20}
              className="size-9 rounded-[10px] p-[10px] bg-fill-neutral-strong-enteredSelected"
            />
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-body1-semibold text-layout-header-default">{t("askTitle")}</h3>
              <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
                {t("askDescription")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon
              name="MessageAlertCircle"
              size={20}
              className="size-9 rounded-[10px] p-[10px] bg-fill-neutral-strong-enteredSelected"
            />
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-body1-semibold text-layout-header-default">
                {t("idCheckTitle")}
              </h3>
              <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
                {t("idCheckDescription")}
              </p>
            </div>
          </div>

          <Button as="a" href={`tel:${formattedPhone(phoneNumber)}`} className="min-h-11 w-full">
            {t("callButton")}
          </Button>
        </div>
      </div>
    </PopupLayout>
  );
};

export default PublicCallBottomSheet;
