import { useQuery } from "@tanstack/react-query";
import { NeighborhoodPlace, NeighborhoodPlaceFilter } from "../../_types/NeighborhoodPlace";
import { MOCK_NEIGHBORHOOD_PLACES } from "./neighborhoodPlaces.mock";

/**
 * 동네 구경 섹션의 장소 목록을 가져옵니다.
 *
 * @remarks
 * 아직 백엔드 API가 없어 목업 데이터를 반환합니다. 실제 컴포넌트는 로딩/에러 상태를
 * 그대로 사용할 수 있도록 TanStack Query 형태를 유지합니다.
 *
 * TODO: 백엔드 연동 시 queryFn을 axios 호출로 교체하고(useAppQuery 등) 목업 파일을 제거한다.
 */
const useNeighborhoodPlaces = (filter: NeighborhoodPlaceFilter) => {
  return useQuery<NeighborhoodPlace[]>({
    queryKey: ["neighborhood-places", filter],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return filter === "ALL"
        ? MOCK_NEIGHBORHOOD_PLACES
        : MOCK_NEIGHBORHOOD_PLACES.filter((place) => place.category === filter);
    },
    staleTime: 1000 * 60,
  });
};

export default useNeighborhoodPlaces;
