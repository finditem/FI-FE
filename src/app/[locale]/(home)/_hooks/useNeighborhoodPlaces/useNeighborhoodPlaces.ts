// TODO(준열) : TODO: 백엔드 연동 시 queryFn을 axios 호출로 교체하고(useAppQuery 등) 목업 파일을 제거한다.

import { useSuspenseQuery } from "@tanstack/react-query";
import { NeighborhoodPlace, NeighborhoodPlaceFilter } from "../../_types/NeighborhoodPlace";
import { MOCK_NEIGHBORHOOD_PLACES } from "./neighborhoodPlaces.mock";

const useNeighborhoodPlaces = (filter: NeighborhoodPlaceFilter) => {
  return useSuspenseQuery<NeighborhoodPlace[]>({
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
