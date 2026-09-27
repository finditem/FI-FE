import { useTranslations } from "next-intl";
import { usePutPostStatus } from "@/api/fetch/post";
import { Button, Icon } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

/**
 * 게시글을 "찾기 완료" 상태로 바꾸기 전 보여주는 확인 모달입니다.
 *
 * @remarks
 * - SEARCHING → FOUND 방향으로 상태를 바꿀 때만 사용합니다.
 * - 두 버튼 모두 상태 변경을 확정하며, "후기 남기기" 이후 실제 후기 작성 화면으로 이동하는 것은
 *   후기 작성 플로우가 아직 없어 이번 범위에서 제외했습니다.
 *
 * @author suhyeon
 */

interface PostFoundConfirmModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 (ESC/백드롭 포함) */
  onClose: () => void;
  /** 찾기 완료로 바꿀 게시글 ID */
  postId: number;
}

/**
 * @example
 * ```tsx
 * <PostFoundConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} postId={123} />
 * ```
 */

const PostFoundConfirmModal = ({ isOpen, onClose, postId }: PostFoundConfirmModalProps) => {
  const t = useTranslations("PostFoundConfirmModal");
  const { mutate: putPostStatus } = usePutPostStatus(postId, false);

  const handleConfirm = () => {
    putPostStatus({ postStatus: "FOUND" });
    onClose();
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="gap-6 p-6 flex-col-center">
      <div className="gap-4 flex-col-center">
        <div className="size-12 rounded-full bg-fill-neutralInversed-normal-enteredSelected flex-center">
          <Icon name="CompleteCheck" size={28} className="text-white" />
        </div>
        <div className="gap-1 text-center flex-col-center">
          <p className="text-h3-semibold text-layout-header-default">{t("title")}</p>
          <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
        </div>
      </div>

      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="min-h-11 flex-1" onClick={handleConfirm}>
          {t("laterLabel")}
        </Button>
        <Button className="min-h-11 flex-1" onClick={handleConfirm}>
          {t("reviewLabel")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default PostFoundConfirmModal;
