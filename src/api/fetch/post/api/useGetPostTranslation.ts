import useAppQuery from "@/api/_base/query/useAppQuery";
import { PostTranslationResponse } from "../types/PostTranslationType";

interface UseGetPostTranslationParams {
  postId: number;
  enabled?: boolean;
}

export const useGetPostTranslation = ({ postId, enabled = true }: UseGetPostTranslationParams) => {
  return useAppQuery<PostTranslationResponse>(
    "auth",
    ["post-translation", postId],
    `/posts/${postId}/translate`,
    { enabled: !!postId && enabled }
  );
};
