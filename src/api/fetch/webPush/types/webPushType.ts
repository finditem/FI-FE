import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface PostPushSubscribeRequest {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PostPushSubscribeResponse extends ApiBaseResponseType<string> {}

export interface DeletePushSubscribeVariables {
  endpoint: string;
}

export interface DeletePushSubscribeResponse extends ApiBaseResponseType<string> {}

export type PushVapidKeyResult = Record<string, string>;

export interface GetPushVapidKeyResponse extends ApiBaseResponseType<PushVapidKeyResult> {}
