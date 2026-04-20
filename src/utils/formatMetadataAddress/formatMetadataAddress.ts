/**
 * 메타데이터에 사용할 주소에서 '동/면/읍' 단위만 추출하는 유틸리티 함수입니다.
 *
 * @remarks
 * - '동', '면', '읍'으로 끝나는 주소 단위가 있으면 해당 부분만 반환합니다.
 * - 해당 단위가 없으면 앞 두 단어(시/구)를 반환합니다.
 * - 값이 없으면 `"주소"`를 반환합니다.
 *
 * @param address - 정제할 주소
 *
 * @returns '동/면/읍' 단위 또는 앞 두 단위 주소
 *
 * @author jikwon
 */

/**
 * @example
 * ```ts
 * formatMetadataAddress("대구광역시 동구 동북로 306-13 (신암동)") // "신암동"
 * formatMetadataAddress("서울특별시 강남구 테헤란로 123")         // "서울특별시 강남구"
 * formatMetadataAddress()                                       // "주소"
 * ```
 */

export const formatMetadataAddress = (address?: string | null) => {
  if (!address) return "주소";

  const addressParts = address.split(" ");

  for (const part of addressParts) {
    const cleanPart = part.replace(/[()]/g, "");
    if (["동", "면", "읍"].some((u) => cleanPart.endsWith(u))) {
      return cleanPart;
    }
  }

  if (addressParts.length >= 2) {
    return `${addressParts[0]} ${addressParts[1]}`;
  }

  return addressParts[0] || "주소";
};
