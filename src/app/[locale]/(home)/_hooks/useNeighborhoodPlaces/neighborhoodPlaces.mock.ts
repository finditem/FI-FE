import { NeighborhoodPlace } from "../../_types/NeighborhoodPlace";

/**
 * 동네 구경 섹션 목업 데이터.
 *
 * TODO: 백엔드 API 연동 시 이 파일과 useNeighborhoodPlaces의 목업 queryFn을 제거한다.
 */
export const MOCK_NEIGHBORHOOD_PLACES: NeighborhoodPlace[] = [
  {
    id: 1,
    name: "젠틀 몬스터 성수 팝업",
    imageUrl: "https://picsum.photos/seed/gentle-monster/200/200",
    address: "서울 성동구 연무장13길 11",
    stationName: "성수역",
    distanceM: 234,
    category: "POPUP",
    status: "OPEN",
    schedule: "26.07.11 ~ 07.13",
  },
  {
    id: 2,
    name: "대림창고",
    imageUrl: "https://picsum.photos/seed/daerim/200/200",
    address: "서울 성동구 성수이로 78",
    stationName: "성수역",
    distanceM: 320,
    category: "CAFE",
    status: "UPCOMING",
    schedule: "07:30~18:00",
  },
  {
    id: 3,
    name: "성수 노루",
    imageUrl: "https://picsum.photos/seed/seongsu-noru/200/200",
    address: "서울 성동구 아차산로 104",
    stationName: "성수역",
    distanceM: 412,
    category: "RESTAURANT",
    status: "OPEN",
    schedule: "07:30~18:00",
  },
  {
    id: 4,
    name: "포인트 오브 뷰 성수",
    imageUrl: "https://picsum.photos/seed/point-of-view/200/200",
    address: "서울 성동구 연무장길 42",
    stationName: "성수역",
    distanceM: 158,
    category: "POPUP",
    status: "OPEN",
    schedule: "26.08.01 ~ 08.31",
  },
  {
    id: 5,
    name: "센터 커피 로스터스",
    imageUrl: "https://picsum.photos/seed/center-coffee/200/200",
    address: "서울 성동구 서울숲2길 28-11",
    stationName: "뚝섬역",
    distanceM: 540,
    category: "CAFE",
    status: "OPEN",
    schedule: "08:00~22:00",
  },
  {
    id: 6,
    name: "소문난 성수 감자탕",
    imageUrl: "https://picsum.photos/seed/gamjatang/200/200",
    address: "서울 성동구 성수일로4길 9",
    stationName: "성수역",
    distanceM: 268,
    category: "RESTAURANT",
    status: "UPCOMING",
    schedule: "11:00~22:00",
  },
];
