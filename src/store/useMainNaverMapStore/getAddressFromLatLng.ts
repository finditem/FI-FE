import { getNaverAddress } from "@/utils";

/**
 * `getAddressFromLatLng`에 넘기는 표시 방식 옵션입니다.
 *
 * @remarks
 * - 기본(`variant` 생략·`short`)은 법정동 이름을 우선 쓰고, 없으면 전체 주소를 씁니다.
 * - `full`이면 도로명 주소를, 없으면 지번 주소를 그대로 반환합니다.
 */

export type GetAddressFromLatLngOptions = {
  /** 동 단위 우선(`short`) vs 전체 주소(`full`) */
  variant?: "short" | "full";
};

/**
 * 좌표를 네이버 SDK로 역지오코딩한 뒤 표시용 주소 한 줄을 반환합니다.
 *
 * @remarks
 * - SDK 요청은 취소할 수 없으므로, `signal`은 호출부가 응답을 버릴지 판단하는 데만 씁니다.
 *
 * @param lat - 위도
 * @param lng - 경도
 * @param signal - 연속 이동 시 이전 요청을 버리기 위한 신호
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
  const { address, fullAddress } = await getNaverAddress(lat, lng);
  signal?.throwIfAborted();

  if (options?.variant === "full") {
    return fullAddress ?? "";
  }

  return address || fullAddress || "";
};
