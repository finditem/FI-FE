"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { usePutPostStatus } from "@/api/fetch/post";
import usePostFindCompletion from "@/api/fetch/chatRoom/api/usePostFindCompletion";
import { Button, Icon } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

/**
 * 게시글을 "찾기 완료" 상태로 바꾸기 전 보여주는 확인 모달입니다.
 *
 * @remarks
 * - SEARCHING → FOUND 방향으로 상태를 바꿀 때만 사용합니다.
 * - `roomId`가 있으면(채팅 상세에서 연 경우) 찾기 완료 API(`POST /chats/{roomId}/find-completion`)를
 *   호출합니다. 채팅 상대가 도움을 준 사용자로 기록되고 게시글도 찾음 상태가 되며, 후기 작성에 필요한
 *   findCompletionId가 발급됩니다. "후기 남기기" 클릭 시에는 완료 후 찾길 후기 작성 페이지로 이동합니다.
 * - `roomId`가 없으면(게시글 상세에서 연 경우, 특정 채팅방이 없어 리뷰 대상이 불명확) 게시글 상태만
 *   `FOUND`로 바꿉니다.
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
  const { mutate: putPostStatus, isPending: isPutPending } = usePutPostStatus(postId, false);
  // roomId가 있을 때만 사용하는 찾기 완료 처리. roomId가 없으면 호출되지 않는다.
  const { mutate: completeFind, isPending: isCompletePending } = usePostFindCompletion(
    roomId ?? 0,
    postId
  );
  const { mutate: completeFindSilently, isPending: isCompleteSilentPending } =
    usePostFindCompletion(roomId ?? 0, postId, { silent: true });
  // 응답을 기다리는 동안 버튼을 비활성화해 같은 요청이 중복 전송되는 것을 막는다.
  const isPending = isPutPending || isCompletePending || isCompleteSilentPending;

  const handleLater = () => {
    if (roomId) {
      completeFind(undefined, { onSuccess: onClose });
      return;
    }
    putPostStatus({ postStatus: "FOUND" });
    onClose();
  };

  const handleReview = () => {
    // roomId가 없으면 리뷰 대상 채팅방을 특정할 수 없어 후기 작성으로 진입하지 않는다.
    if (!roomId) {
      putPostStatus({ postStatus: "FOUND" });
      onClose();
      return;
    }

    completeFindSilently(undefined, {
      onSuccess: () => {
        onClose();
        router.push(`/write/review/${roomId}`);
      },
    });
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
        <Button
          variant="outlined"
          className="min-h-11 flex-1"
          onClick={handleLater}
          disabled={isPending}
        >
          {t("laterLabel")}
        </Button>
        <Button className="min-h-11 flex-1" onClick={handleReview} disabled={isPending}>
          {t("reviewLabel")}
        </Button>
      </div>
    </ModalLayout>
  );
};

export default PostFoundConfirmModal;
