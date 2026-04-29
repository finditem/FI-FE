import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetPushVapidKeyResponse } from "../types/webPushType";

export const useGetPushVapidKey = (options?: { enabled?: boolean }) => {
  return useAppQuery<GetPushVapidKeyResponse, unknown>(
    "public",
    ["/push/vapid-key"],
    "/push/vapid-key",
    options
  );
};
