import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { ModalLayout } from "@/components";

interface ChatLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const BUTTON_STYLE = "w-[132px] h-9 text-body2-semibold rounded-[10px] py-2 flex-center";
const BUTTON_STYLE_CANCEL =
  "bg-white text-neutral-normal-default border border-neutral-normal-default";
const BUTTON_STYLE_CONFIRM = "bg-fill-brand-strong-default text-white";

const ChatLeaveModal = ({ isOpen, onClose, onConfirm, onCancel }: ChatLeaveModalProps) => {
  const t = useTranslations("ChatLeaveModal");
  const buttons = [
    {
      key: "cancel",
      label: t("cancelLabel"),
      onClick: onCancel,
      style: BUTTON_STYLE_CANCEL,
    },
    {
      key: "confirm",
      label: t("confirmLabel"),
      onClick: onConfirm,
      style: BUTTON_STYLE_CONFIRM,
    },
  ] as const;

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      dialogTestId="confirm-modal"
      className="gap-6 rounded-lg p-6 flex-col-center"
    >
      <div className="gap-4 flex-col-center">
        <div className="gap-1 text-center flex-col-center">
          <p className="text-h3-semibold text-layout-header-default">{t("title")}</p>
          <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="w-full gap-2 flex-center">
        {buttons.map(({ key, label, onClick, style }) => (
          <button
            key={key}
            type="button"
            onClick={onClick}
            data-testid={key === "confirm" ? "modal-confirm" : "modal-cancel"}
            className={cn(BUTTON_STYLE, style)}
          >
            {label}
          </button>
        ))}
      </div>
    </ModalLayout>
  );
};

export default ChatLeaveModal;
