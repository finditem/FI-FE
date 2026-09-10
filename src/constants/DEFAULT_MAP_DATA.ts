/**
 * 기본 지도 중심 좌표·주소 상수 모음입니다.
 *
 * @author hyungjun
 */

/**
 * GPS 미허용·복원 전 등 지도 중심이 정해지지 않았을 때 사용하는 기본 좌표(성수역 인근).
 * 서비스 데이터가 성수동 일대에만 있어, 위치를 모르는 사용자에게도 실제 콘텐츠가 보이도록
 * 성수역을 기본값으로 둡니다. {@link DEFAULT_ADDRESS}와 동일한 행정구역을 가리키도록 맞춘 값입니다.
 */
export const DEFAULT_LAT_LNG = { lat: 37.544583, lng: 127.055972 };

/**
 * {@link DEFAULT_LAT_LNG}에 대응하는 기본 주소 문자열.
 * 검색 UI 플레이스홀더·역지오코딩 전 표시 등에 사용됩니다.
 */
export const DEFAULT_ADDRESS = "서울특별시 성동구 성수동";

/**
 * 지도 중심이 정해지지 않았을 때 사용하는 기본 줌 레벨.
 * 성수역 일대가 화면을 채우도록 건물 단위(카카오 지도 축척 약 50m)로 둡니다.
 */
export const DEFAULT_MAP_LEVEL = 3;
