/**
 * VWorldAddressSearch API의 응답 데이터 타입 정의입니다.
 *
 * @author jikwon
 */

export interface VWorldAddressItem {
  address: {
    /** 도로명 주소 */
    road: string;
    /** 지번 주소 */
    parcel: string;
  };
  point: {
    /** 경도 */
    x: string;
    /** 위도 */
    y: string;
  };
  /** 주소 명칭 */
  title: string;
}
