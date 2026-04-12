import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { UserType } from "@/types";

export interface GetUsersMeResponse extends ApiBaseResponseType<UsersMeType> {}

export interface UsersMeType {
  userId: number;
  nickname: string;
  email: string;
  profileImg: string;
  role: UserType;
  socialUser: boolean;
}
