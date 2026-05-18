/**
 * 기본 지도 중심 좌표·주소 상수 모음입니다.
 *
 * @author hyungjun
 */

/**
 * GPS 미허용·복원 전 등 지도 중심이 정해지지 않았을 때 사용하는 기본 좌표(서울 시청 인근).
 * {@link DEFAULT_ADDRESS}와 동일한 행정구역을 가리키도록 맞춘 값입니다.
 */
export const DEFAULT_LAT_LNG = { lat: 37.5665, lng: 126.978 };

/**
 * {@link DEFAULT_LAT_LNG}에 대응하는 기본 주소 문자열.
 * 검색 UI 플레이스홀더·역지오코딩 전 표시 등에 사용됩니다.
 */
export const DEFAULT_ADDRESS = "서울특별시 중구";
