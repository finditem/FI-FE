import { Button, ModalLayout } from "@/components";

interface TempModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
}

const TempModal = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: TempModalProps) => {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="rounded-[8px] p-6">
      <div className="space-y-6 flex-col-center">
        <div className="space-y-1 text-center">
          <h2 className="text-h3-semibold text-layout-header-default">{title}</h2>
          <p className="text-body2-regular text-layout-body-default">{description}</p>
        </div>
        <div className="w-full gap-2 flex-center">
          <Button variant="outlined" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default TempModal;
