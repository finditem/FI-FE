import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface kakaoLoginResponseType extends ApiBaseResponseType<kakaoLoginType> {}

export interface kakaoLoginType {
  userId: number;
  isTemporaryPassword: boolean;
  isNewUser: boolean;
}
