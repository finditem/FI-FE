import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { PlaceSummary } from "@/api/fetch/mapController";

export interface FavoritePlacesResult {
  places: PlaceSummary[];
  hasNext: boolean;
  /** 다음 페이지 요청 시 `lastFavoriteUpdatedAt`으로 보낼 커서 */
  nextFavoriteUpdatedAt: string | null;
  // TODO(준열): 백엔드에 type 조건별 전체 개수(totalCount) 추가를 요청했다. 응답에 포함되면 optional을 해제한다.
  totalCount?: number;
}

export interface FavoritePlacesResponse extends ApiBaseResponseType<FavoritePlacesResult> {}
