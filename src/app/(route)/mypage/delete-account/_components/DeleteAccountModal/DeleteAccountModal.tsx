import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

interface DeleteAccountModalProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onBack: () => void;
}

const DeleteAccountModal = ({ modalOpen, setModalOpen, onBack }: DeleteAccountModalProps) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <ModalLayout
      className="w-[350px] gap-6 rounded-[8px] p-6 flex-col-center"
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
    >
      <h3 className="text-h3-semibold text-layout-header-default">정말로 탈퇴하시겠습니까?</h3>

      <div className="flex w-full gap-2">
        <Button
          variant="outlined"
          size="big"
          className="w-full"
          onClick={() => {
            setModalOpen(false);
            onBack();
          }}
        >
          취소
        </Button>
        <Button
          size="big"
          onClick={() => {
            handleSubmit((data) => {
              const formElement = document.querySelector("form");
              formElement?.requestSubmit();
            })();
          }}
          loading={isSubmitting}
          className="w-full !bg-system-warning"
        >
          탈퇴하기
        </Button>
      </div>
    </ModalLayout>
  );
};

export default DeleteAccountModal;
