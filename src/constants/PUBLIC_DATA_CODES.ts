/**
 * 공공데이터 포털 경찰청 API에서 사용하는 코드 상수 목록입니다.
 *
 * @author jikwon
 */

/** 물품 대분류 코드 */
export const PUBLIC_CATEGORY_CODES = [
  { value: "PRA000", label: "가방" },
  { value: "PRO000", label: "귀금속" },
  { value: "PRB000", label: "도서용품" },
  { value: "PRC000", label: "서류" },
  { value: "PRD000", label: "산업용품" },
  { value: "PRQ000", label: "쇼핑백" },
  { value: "PRE000", label: "스포츠용품" },
  { value: "PRR000", label: "악기" },
  { value: "PRM000", label: "유가증권" },
  { value: "PRK000", label: "의류" },
  { value: "PRF000", label: "자동차" },
  { value: "PRG000", label: "전자기기" },
  { value: "PRH000", label: "지갑" },
  { value: "PRN000", label: "증명서" },
  { value: "PRI000", label: "컴퓨터" },
  { value: "PRP000", label: "카드" },
  { value: "PRL000", label: "현금" },
  { value: "PRJ000", label: "휴대폰" },
  { value: "PRZ000", label: "기타물품" },
] as const;

/** 지역 코드 */
export const PUBLIC_REGION_CODES = [
  { value: "LCA000", label: "서울특별시" },
  { value: "LCB000", label: "부산광역시" },
  { value: "LCC000", label: "대구광역시" },
  { value: "LCD000", label: "인천광역시" },
  { value: "LCE000", label: "광주광역시" },
  { value: "LCF000", label: "대전광역시" },
  { value: "LCG000", label: "울산광역시" },
  { value: "LCH000", label: "경기도" },
  { value: "LCI000", label: "강원도" },
  { value: "LCJ000", label: "충청북도" },
  { value: "LCK000", label: "충청남도" },
  { value: "LCL000", label: "전라북도" },
  { value: "LCM000", label: "전라남도" },
  { value: "LCN000", label: "경상북도" },
  { value: "LCO000", label: "경상남도" },
  { value: "LCP000", label: "제주특별자치도" },
  { value: "LCQ000", label: "세종특별자치시" },
  { value: "LCW000", label: "기타" },
] as const;
