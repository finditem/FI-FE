"use client";

import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { FindCompletionResponse } from "../types/ChatRoomResponse";

interface UsePostFindCompletionOptions {
  /** true면 성공 토스트를 띄우지 않는다. 실패 토스트는 항상 띄운다. (default: false) */
  silent?: boolean;
}

/**
 * 채팅방에서 분실물 찾기 완료를 처리한다. 채팅 상대가 도움을 준 사용자로 기록되고 게시글은 찾음
 * 상태가 되며, 후기 작성에 쓰이는 findCompletionId가 발급된다.
 *
 * @remarks
 * 성공 시 채팅방 상세(findCompletion 갱신)와 게시글 상세/목록 캐시를 무효화한다. 후기 작성 페이지는
 * 채팅방 상세의 findCompletion.findCompletionId를 다시 읽어 사용하므로, 이 무효화로 최신 완료 상태가
 * 반영된다.
 *
 * @example
 * ```ts
 * const { mutate: completeFind } = usePostFindCompletion(roomId, { silent: true });
 * completeFind(undefined, { onSuccess: () => router.push(`/write/review/${roomId}`) });
 * ```
 */
const usePostFindCompletion = (
  roomId: number,
  postId: number,
  options?: UsePostFindCompletionOptions
) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePostFindCompletion");
  const silent = options?.silent ?? false;

  return useAppMutation<
    undefined,
    ApiBaseResponseType<FindCompletionResponse>,
    AxiosError<ApiBaseResponseType<null>>
  >("auth", `/chats/${roomId}/find-completion`, "post", {
    onSuccess: () => {
      if (!silent) addToast(t("completeSuccess"), "success");
      queryClient.invalidateQueries({ queryKey: ["chatRoomDetail", roomId] });
      queryClient.invalidateQueries({ queryKey: ["post-detail", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] });
    },
    onError: (error) => {
      if (error.response?.data.code === "FIND_COMPLETION409-ALREADY_COMPLETED") {
        addToast(t("alreadyCompleted"), "warning");
        return;
      }
      addToast(t("completeError"), "error");
    },
  });
};

export default usePostFindCompletion;
