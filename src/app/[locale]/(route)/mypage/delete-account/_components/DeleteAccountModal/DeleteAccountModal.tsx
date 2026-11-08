import { Button, ModalLayout } from "@/components";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

interface DeleteAccountModalProps {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  onBack: () => void;
}

const DeleteAccountModal = ({ modalOpen, setModalOpen, onBack }: DeleteAccountModalProps) => {
  const t = useTranslations("DeleteAccountModal");
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
      <h3 className="text-h3-semibold text-layout-header-default">{t("title")}</h3>

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
          {t("cancelButton")}
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
          {t("deleteButton")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default DeleteAccountModal;
