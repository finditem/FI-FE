import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface GetUsersMeTemperatureResponse extends ApiBaseResponseType<UserTemperatureType> {}

export interface UserTemperatureType {
  /** 찾길 온도(℃). 소수 첫째 자리까지 내려오며 범위는 0.0~99.0, 신규 사용자는 36.5 */
  temperature: number;
  /**
   * 온도 계산 시각. 타임존이 없는 KST 로컬 시각 ISO 문자열이라 `new Date()`로 바로 파싱하면
   * 기기 타임존 기준으로 어긋난다. 한 번도 계산되지 않은 사용자는 `null`이다.
   */
  calculatedAt: string | null;
}
