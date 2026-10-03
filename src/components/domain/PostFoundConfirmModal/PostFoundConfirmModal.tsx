"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { usePutPostStatus } from "@/api/fetch/post";
import { Button, Icon } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

/**
 * 게시글을 "찾기 완료" 상태로 바꾸기 전 보여주는 확인 모달입니다.
 *
 * @remarks
 * - SEARCHING → FOUND 방향으로 상태를 바꿀 때만 사용합니다.
 * - 두 버튼 모두 상태 변경을 확정합니다. `roomId`가 있으면(채팅 상세에서 연 경우) "후기 남기기" 클릭 시
 *   찾길 후기 작성 페이지로 이동합니다. `roomId`가 없으면(게시글 상세에서 연 경우, 특정 채팅방이 없어
 *   리뷰 대상이 불명확) 상태 변경만 수행합니다.
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
  /** 채팅방 ID. 있으면 "후기 남기기" 클릭 시 해당 채팅방 기준 후기 작성 페이지로 이동 */
  roomId?: number;
}

/**
 * @example
 * ```tsx
 * <PostFoundConfirmModal isOpen={isOpen} onClose={() => setIsOpen(false)} postId={123} roomId={456} />
 * ```
 */

const PostFoundConfirmModal = ({ isOpen, onClose, postId, roomId }: PostFoundConfirmModalProps) => {
  const t = useTranslations("PostFoundConfirmModal");
  const router = useRouter();
  const { mutate: putPostStatus } = usePutPostStatus(postId, false);
  const { mutate: putPostStatusSilently } = usePutPostStatus(postId, false, { silent: true });

  const handleLater = () => {
    putPostStatus({ postStatus: "FOUND" });
    onClose();
  };

  const handleReview = () => {
    putPostStatusSilently(
      { postStatus: "FOUND" },
      {
        onSuccess: () => {
          onClose();

          if (roomId) {
            router.push(`/write/review/${roomId}`);
          }
        },
      }
    );
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="gap-6 p-6 flex-col-center">
      <div className="gap-6 flex-col-center">
        <Icon name="Good" size={48} />
        <div className="gap-1 text-center flex-col-center">
          <p className="text-h3-semibold text-layout-header-default">{t("title")}</p>
          <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
        </div>
      </div>

      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="min-h-11 flex-1" onClick={handleLater}>
          {t("laterLabel")}
        </Button>
        <Button className="min-h-11 flex-1" onClick={handleReview}>
          {t("reviewLabel")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default PostFoundConfirmModal;
