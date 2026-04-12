import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface KakaoLoginResponseType extends ApiBaseResponseType<KakaoLoginType> {}

export interface KakaoLoginType {
  userId: number;
  isTemporaryPassword: boolean;
  termsAgreed: boolean;
}
