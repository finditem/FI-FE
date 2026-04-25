/**
 * 공공데이터 포털 습득물 조회 API 관련 타입 정의입니다.
 *
 * @author jikwon
 */

export interface PublicDataItem {
  /** 관리번호 */
  atcId: string;
  /** 보관장소 */
  depPlace: string;
  /** 습득물 사진 */
  fdFilePathImg: string;
  /** 물품명 */
  fdPrdtNm: string;
  /** 습득물 명칭 */
  fdSbjt: string;
  /** 습득일자 */
  fdYmd: string;
  /** 물품명 */
  prdtClNm: string;
  /** 순번 */
  rnum: string;
}

export interface PublicDataResponse {
  items: {
    /** 단건이면 객체, 복수이면 배열로 반환됨 */
    item: PublicDataItem | PublicDataItem[];
  };
  /** 페이지당 결과 수 */
  numOfRows: number;
  /** 현재 페이지 번호 */
  pageNo: number;
  /** 전체 결과 수 */
  totalCount: number;
}
