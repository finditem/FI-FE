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
  const buttons = [
    {
      key: "cancel",
      label: "아니요",
      onClick: onCancel,
      style: BUTTON_STYLE_CANCEL,
    },
    {
      key: "confirm",
      label: "네, 나갈래요",
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
          <p className="text-h3-semibold text-layout-header-default">채팅방을 나가시겠어요?</p>
          <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
            {`채팅방을 나가면 채팅 목록 및 대화 내용이 삭제되고\n복구할 수 없어요. 채팅방에서 나가시겠어요?`}
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
