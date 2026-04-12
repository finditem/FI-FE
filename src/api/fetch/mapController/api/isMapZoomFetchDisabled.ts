const MAP_FETCH_DISABLED_LEVEL_MIN = 9;
const MAP_FETCH_DISABLED_LEVEL_MAX = 13;

export const isMapZoomFetchDisabled = (mapLevel: number): boolean => {
  return mapLevel >= MAP_FETCH_DISABLED_LEVEL_MIN && mapLevel <= MAP_FETCH_DISABLED_LEVEL_MAX;
};
