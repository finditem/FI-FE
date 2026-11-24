import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";
import { trackClickWriteButton, WriteButtonLocation } from "@/utils/analytics/analytics";

/**
 * 발견했어요 글쓰기로 들어가기 전에 경찰청 우선 신고를 안내하는 모달 컴포넌트입니다.
 *
 * @remarks
 * - 글쓰기 버튼은 `/write/post?type=find`로 이동합니다. 비로그인 사용자는 미들웨어가 로그인 화면으로 보냅니다.
 * - 발견했어요 글쓰기 진입점마다 같은 안내를 보여 주기 위해 전역으로 둡니다.
 */

interface FindWarningModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 글쓰기 버튼 클릭 추적에 남길, 모달을 연 화면 */
  location: WriteButtonLocation;
}

/**
 * @example
 * ```tsx
 * <FindWarningModal isOpen={isOpen} onClose={() => setIsOpen(false)} location="home" />
 * ```
 */

const FindWarningModal = ({ isOpen, onClose, location }: FindWarningModalProps) => {
  const t = useTranslations("FindWarningModal");

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="min-h-[186px] w-[350px] gap-6 p-6 flex-col-center"
    >
      <div className="gap-1 flex-col-center">
        <h2 className="text-h3-semibold text-layout-header-default">{t("title")}</h2>
        <span className="text-body5-regular text-center text-layout-body-default">
          {t("description")}
        </span>
      </div>

      <div className="flex w-full gap-2">
        <Button variant="outlined" className="min-h-11 w-full" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          as={Link}
          href="/write/post?type=find"
          className="min-h-11 w-full"
          onClick={() => trackClickWriteButton(location)}
        >
          {t("write")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default FindWarningModal;
