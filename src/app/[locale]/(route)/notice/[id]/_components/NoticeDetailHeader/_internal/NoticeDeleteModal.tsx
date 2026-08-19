import { useDeleteNotice } from "@/api/fetch/admin";
import { Button, ModalLayout } from "@/components";
import { useTranslations } from "next-intl";

interface NoticeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

const BUTTON_STYLE = "min-h-11 flex-1";

const NoticeDeleteModal = ({ isOpen, onClose, postId }: NoticeDeleteModalProps) => {
  const t = useTranslations("NoticePage.deleteModal");
  const { mutate: deleteNotice } = useDeleteNotice(postId);

  const handleDeleteNotice = () => {
    deleteNotice({});
    onClose();
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[350px] gap-6 rounded-[8px] p-6 flex-col-center"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-h3-semibold text-layout-header-default">{t("title")}</h2>
        <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" onClick={onClose} className={BUTTON_STYLE}>
          {t("cancel")}
        </Button>
        <Button onClick={handleDeleteNotice} className={BUTTON_STYLE}>
          {t("confirm")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default NoticeDeleteModal;
