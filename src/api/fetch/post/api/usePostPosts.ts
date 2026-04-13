"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { PostPostsWriteResponse } from "../types/PostWriteType";
import { useWriteFlowStore } from "@/store";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const usePostPosts = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setShowManualPopup } = useWriteFlowStore();

  return useAppMutation<FormData, PostPostsWriteResponse>("auth", "/posts", "post", {
    onSuccess: async (data, variables) => {
      if (variables.has("tempPostId")) {
        queryClient.invalidateQueries({ queryKey: ["temp-post"] });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] }),
        queryClient.invalidateQueries({ queryKey: ["similar"] }),
      ]);

      addToast("게시글이 등록되었습니다.", "success");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("showManualPopup", "true");
      }
      setShowManualPopup(true);
      router.replace(`/list/${data.result.id}`);
    },
    onError: () => {
      addToast("게시글 등록에 실패했습니다.", "error");
    },
  });
};
