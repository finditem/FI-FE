import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

/**
 * 비회원이 로그인이 필요한 기능을 시도할 때 표시되는 로그인 유도 모달 컴포넌트입니다.
 *
 * @remarks
 * 댓글·답글 작성, 좋아요, 신고/차단 등 여러 진입점에서 공통으로 사용되므로 문구는 특정 동작에 종속되지 않습니다.
 *
 * @author jikwon
 */

interface GuestLoginModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}

/**
 * @example
 * ```tsx
 * <GuestLoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */

const GuestLoginModal = ({ isOpen, onClose }: GuestLoginModalProps) => {
  const t = useTranslations("GuestLoginModal");

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="space-y-6 rounded-[8px] p-6">
      <div className="gap-1 text-center flex-col-center">
        <h2 className="text-h3-semibold text-layout-header-default">{t("title")}</h2>
        <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="min-h-11 w-[147px] flex-1" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button as={Link} href="/login" className="min-h-11 w-[147px] flex-1">
          {t("login")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default GuestLoginModal;
