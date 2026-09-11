import { setFavoriteInPlaceList, setFavoriteInPlaceSummary } from "./usePlaceFavorite";
import type { PlaceSummary } from "../types/SearchLocationPlacesType";

const place = (placeId: number, isFavorite: boolean) =>
  ({
    placeId,
    name: `장소 ${placeId}`,
    address: "서울특별시 성동구",
    latitude: 37.5,
    longitude: 127.05,
    station: "성수역",
    stationDistanceMeters: 100,
    type: "CAFE",
    thumbnailUrl: "",
    operationStatus: "OPEN",
    operationPeriod: null,
    todayBusinessHours: null,
    isFavorite,
  }) as PlaceSummary;

const wrap = <T>(result: T) => ({ isSuccess: true, code: "COMMON200", message: "성공", result });

describe("usePlaceFavorite 캐시 패치", () => {
  describe("setFavoriteInPlaceSummary", () => {
    it("상세 캐시의 isFavorite를 뒤집는다", () => {
      const next = setFavoriteInPlaceSummary(wrap(place(1, false)), true);
      expect(next?.result.isFavorite).toBe(true);
    });

    it("캐시가 없으면 그대로 둔다", () => {
      expect(setFavoriteInPlaceSummary(undefined, true)).toBeUndefined();
    });
  });

  describe("setFavoriteInPlaceList", () => {
    it("해당 placeId만 뒤집고 나머지는 건드리지 않는다", () => {
      const cache = wrap({ places: [place(1, false), place(2, false)] });

      const next = setFavoriteInPlaceList(cache, 2, true);

      expect(next?.result.places?.map((p) => p.isFavorite)).toEqual([false, true]);
    });

    it("목록에 없는 placeId면 아무것도 바뀌지 않는다", () => {
      const cache = wrap({ places: [place(1, false)] });

      const next = setFavoriteInPlaceList(cache, 99, true);

      expect(next?.result.places?.[0].isFavorite).toBe(false);
    });

    it("places가 없는 캐시는 그대로 둔다", () => {
      const cache = wrap({ placeMarkers: [] }) as never;
      expect(setFavoriteInPlaceList(cache, 1, true)).toBe(cache);
    });

    it("원본 배열을 변경하지 않는다", () => {
      const original = place(1, false);
      const cache = wrap({ places: [original] });

      setFavoriteInPlaceList(cache, 1, true);

      expect(original.isFavorite).toBe(false);
    });
  });
});
