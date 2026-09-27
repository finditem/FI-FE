import { getKakaoLocalCoord2Address } from "@/api/fetch/kakao";
import { extractDongAddress } from "@/utils";

/**
 * `getAddressFromLatLng`에 넘기는 표시 방식 옵션입니다.
 *
 * @remarks
 * - 기본(`variant` 생략·`short`)은 `extractDongAddress`로 동 단위를 우선 쓰고, 없으면 도로명·지번 원문을 이어 붙입니다.
 * - `full`이면 API의 도로명 또는 지번 주소 문자열을 우선 그대로 반환합니다.
 */

export type GetAddressFromLatLngOptions = {
  /** 동 단위 우선(`short`) vs 원문 위주(`full`) */
  variant?: "short" | "full";
};

/**
 * 좌표를 카카오 API로 조회한 뒤 표시용 주소 한 줄을 반환합니다.
 *
 * @remarks
 * - `signal`이 중단되면 상위에서 후속 처리를 생략할 수 있도록 API 호출에 그대로 넘깁니다.
 *
 * @param lat - 위도
 * @param lng - 경도
 * @param signal - 연속 이동 시 이전 요청 취소용
 * @param options - `variant`로 짧은 라벨 vs 전체 주소 선택
 *
 * @returns 지도·검색창 등에 표시할 주소 문자열
 *
 * @author hyungjun
 */

/**
 * @example
 * ```ts
 * const shortLabel = await getAddressFromLatLng(37.5665, 126.978, undefined, { variant: "short" });
 * const fullLine = await getAddressFromLatLng(37.5665, 126.978, undefined, { variant: "full" });
 * ```
 */

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
