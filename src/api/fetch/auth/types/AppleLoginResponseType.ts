import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface AppleLoginResponseType extends ApiBaseResponseType<AppleLoginType> {}

export interface AppleLoginType {
  userId: number;
  isTemporaryPassword: boolean;
  termsAgreed: boolean;
}
