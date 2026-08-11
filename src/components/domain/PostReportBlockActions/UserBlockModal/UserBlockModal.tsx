import { useTranslations } from "next-intl";
import { useBlock } from "@/api/fetch/report";
import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

/**
 * 유저 차단 확인 모달 컴포넌트입니다.
 *
 * @author jikwon
 */

interface UserBlockModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 차단할 작성자 ID */
  writerId: number;
}

/**
 * @example
 * ```tsx
 * <UserBlockModal isOpen={isOpen} onClose={() => setIsOpen(false)} writerId={123} />
 * ```
 */

const UserBlockModal = ({ isOpen, onClose, writerId }: UserBlockModalProps) => {
  const t = useTranslations("UserBlockModal");
  const { mutate: blockUser } = useBlock({
    onClose,
    userId: writerId,
  });

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="space-y-6 rounded-[8px] bg-white p-6">
      <div className="space-y-1 text-center">
        <p className="text-h3-semibold text-layout-header-default">{t("title")}</p>
        <span className="text-body2-regular text-layout-body-default">{t("description")}</span>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="min-h-11 flex-1" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button className="min-h-11 flex-1" onClick={() => blockUser()}>
          {t("confirm")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default UserBlockModal;
