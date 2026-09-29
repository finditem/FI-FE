/**
 * 네이버 역지오코딩 결과를 게시글 위치 선택 화면에서 쓰는 주소 두 개로 조립합니다.
 *
 * @remarks
 * - `fullAddress`는 서버에 게시글 주소로 저장되고 `keyword` 검색 대상이 되므로, 카카오 `coord2address`의
 *   `address_name`과 같은 모양으로 만듭니다. 도로명 주소를 우선하고, 없으면 지번 주소를 씁니다.
 * - 카카오 출력에 맞춰 도로명은 시도 전체 이름(`서울특별시`), 지번은 시도 약칭(`서울`)을 씁니다.
 * - `address`는 화면 제목("성수동2가 근처")에만 쓰는 법정동 이름입니다. 서버에 저장하지 않습니다.
 * - 규칙의 근거는 `docs/naver-map/rest-api.md`의 게시글 주소 조립 규칙에 있습니다.
 *
 * @author junyeol
 */

export type NaverAddress = {
  /** 화면 제목용 동 이름 (예: `성수동2가`) */
  address: string | null;
  /** 서버에 저장하는 전체 주소 (예: `서울특별시 성동구 성수이로 147`) */
  fullAddress: string | null;
};

/** SDK 타입에는 없지만 응답에는 시도 약칭(`alias`)이 들어옵니다. */
type ResultItem = naver.maps.Service.ResultItem & {
  region: { area1: { alias?: string } };
};

/** 역지오코딩에 요청할 결과 종류. 순서대로 법정동, 도로명 주소, 지번 주소입니다. */
export const NAVER_ADDRESS_ORDERS = "legalcode,roadaddr,addr";

const formatLandNumber = ({ number1, number2 }: { number1: string; number2: string }) =>
  number2 ? `${number1}-${number2}` : number1;

export const formatNaverAddress = (results: ResultItem[]): NaverAddress => {
  const findResult = (name: string) => results.find((result) => result.name === name);

  const legal = findResult("legalcode");
  const road = findResult("roadaddr");
  const jibun = findResult("addr");

  const address = legal?.region.area3.name || legal?.region.area2.name || null;

  if (road) {
    const { area1, area2 } = road.region;
    return {
      address,
      fullAddress: [area1.name, area2.name, road.land.name, formatLandNumber(road.land)].join(" "),
    };
  }

  if (jibun) {
    const { area1, area2, area3 } = jibun.region;
    const mountainPrefix = jibun.land.type === "2" ? "산 " : "";
    return {
      address,
      fullAddress: [
        area1.alias ?? area1.name,
        area2.name,
        area3.name,
        `${mountainPrefix}${formatLandNumber(jibun.land)}`,
      ].join(" "),
    };
  }

  return { address, fullAddress: null };
};

/**
 * 좌표를 네이버 SDK로 역지오코딩해 주소를 반환합니다.
 *
 * @remarks
 * - `naver.maps.Service`는 `geocoder` 서브모듈이 로드된 뒤에만 쓸 수 있습니다. `BaseNaverMap`이 함께 로드합니다.
 *
 * @example
 * ```ts
 * const { address, fullAddress } = await getNaverAddress(37.548, 127.0579);
 * // address: "성수동2가", fullAddress: "서울특별시 성동구 성수이로 147"
 * ```
 */
export const getNaverAddress = (lat: number, lng: number): Promise<NaverAddress> =>
  new Promise((resolve, reject) => {
    naver.maps.Service.reverseGeocode(
      { coords: new naver.maps.LatLng(lat, lng), orders: NAVER_ADDRESS_ORDERS },
      (status, response) => {
        if (status !== naver.maps.Service.Status.OK) {
          reject(new Error(`reverseGeocode failed: ${status}`));
          return;
        }
        resolve(formatNaverAddress(response.v2.results as ResultItem[]));
      }
    );
  });
