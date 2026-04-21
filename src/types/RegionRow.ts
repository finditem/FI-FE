/**
 * 지역 정보를 표현하는 데이터 타입입니다.
 *
 * @author jikwon
 */

export type RegionRow = {
  /** 시/도 단위 지역명 */
  sido: string;
  /** 시/군/구 단위 지역명 */
  sigungu: string;
  /** 지역 전체 식별 문자열 */
  location: string;
  /** UI에 표시하기 위한 지역명 문자열 */
  display: string;
};
