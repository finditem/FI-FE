import { getKakaoLocalCoord2Address } from "@/api/fetch/kakao";
import { extractDongAddress } from "@/utils";

/**
 * 카카오 좌표→주소 변환 API를 이용해 지도 표시용 주소를 반환합니다.
 *
 * @author hyungjun
 * @description
 * - 좌표(lat, lng)를 카카오 API로 변환한 뒤,
 * - 기본(`variant: "short"`)은 `address_name`에서 `00동` 단위 문자열을 우선 추출하고,
 *   실패 시 `road_address`/`address` 원문을 fallback으로 사용합니다.
 * - `variant: "full"`이면 도로명·지번 주소 원문을 그대로 반환합니다(플레이스홀더 등).
 *
 * @param lat 위도(y)
 * @param lng 경도(x)
 * @param signal 요청 취소를 위한 AbortSignal(연속 좌표 변경 시 이전 요청을 취소하기 위해 사용)
 * @returns 지도 표시용 주소 문자열
 *
 * @example
 * ```ts
 * const text = await getAddressFromLatLng(37.566370748, 126.977918341);
 * // => "서울특별시 중구" 또는 "00동" 형태
 * ```
 */

export type GetAddressFromLatLngOptions = {
  /** `"short"`(기본): 동 단위 우선. `"full"`: API `road_address`/`address` 전체 문자열 */
  variant?: "short" | "full";
};

export const getAddressFromLatLng = async (
  lat: number,
  lng: number,
  signal?: AbortSignal,
  options?: GetAddressFromLatLngOptions
): Promise<string> => {
  const data = await getKakaoLocalCoord2Address(lat, lng, signal);
  const firstDocument = data.documents?.[0];
  const roadAddress = firstDocument?.road_address?.address_name ?? "";
  const jibunAddress = firstDocument?.address?.address_name ?? "";

  if (options?.variant === "full") {
    return roadAddress || jibunAddress || "";
  }

  const dongAddress = extractDongAddress(jibunAddress) || extractDongAddress(roadAddress);
  return dongAddress || roadAddress || jibunAddress || "";
};
