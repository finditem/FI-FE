import useAppMutation from "@/api/_base/query/useAppMutation";
import { PostPushSubscribeRequest, PostPushSubscribeResponse } from "../types/webPushType";

export const usePostPushSubscribe = () => {
  return useAppMutation<PostPushSubscribeRequest, PostPushSubscribeResponse>(
    "auth",
    "/push/subscribe",
    "post"
  );
};
