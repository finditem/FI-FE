import useAppMutation from "@/api/_base/query/useAppMutation";
import { DeletePushSubscribeResponse, DeletePushSubscribeVariables } from "../types/webPushType";

export const useDeletePushSubscribe = () => {
  return useAppMutation<DeletePushSubscribeVariables, DeletePushSubscribeResponse>(
    "auth",
    ({ endpoint }) => `/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`,
    "delete"
  );
};
