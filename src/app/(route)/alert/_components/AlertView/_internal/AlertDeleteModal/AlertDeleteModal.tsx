import { cn } from "@/utils";
import { ModalLayout } from "@/components";

interface AlertDeleteModalProps {
  isOpen: boolean;
  disabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const BUTTON_STYLE = "w-[132px] h-9 text-body2-semibold rounded-[10px] py-2 flex-center";
const BUTTON_STYLE_CANCEL =
  "bg-white text-neutral-normal-default border border-neutral-normal-default";
const BUTTON_STYLE_CONFIRM = "bg-fill-brand-strong-default text-white";

const AlertDeleteModal = ({
  isOpen,
  disabled,
  onClose,
  onConfirm,
  onCancel,
}: AlertDeleteModalProps) => {
  const buttons = [
    {
      key: "cancel",
      label: "아니요",
      onClick: onCancel,
      style: BUTTON_STYLE_CANCEL,
    },
    {
      key: "confirm",
      label: "삭제하기",
      onClick: onConfirm,
      style: BUTTON_STYLE_CONFIRM,
    },
  ] as const;

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className={cn("gap-6 p-6 flex-col-center")}>
      <div className="gap-4 flex-col-center">
        <div className="gap-1 text-center flex-col-center">
          <div className="text-h3-semibold text-layout-header-default">
            정말로 알림을 삭제하시겠어요?
          </div>
          <div className="text-body2-regular text-layout-body-default">
            삭제한 알림은 복구할 수 없습니다.
          </div>
        </div>
      </div>

      <div className="w-full gap-2 flex-center">
        {buttons.map(({ key, label, onClick, style }) => (
          <button
            key={key}
            disabled={disabled && key === "confirm"}
            type="button"
            onClick={onClick}
            className={cn(BUTTON_STYLE, style)}
          >
            {label}
          </button>
        ))}
      </div>
    </ModalLayout>
  );
};

export default AlertDeleteModal;
