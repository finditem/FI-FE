/**
 * 이미지 목록 중 사용자가 선택한 썸네일의 인덱스와, UI에 보여 줄 선택 순서를 담습니다.
 *
 * @remarks
 * - `ImageSelectButton` 등에서 `File[]`의 어느 항목이 골라졌는지와 뱃지 순번을 부모 state로 들고 있을 때 씁니다.
 * - `order`는 선택이 토글될 때마다 다시 매깁니다.
 *
 * @author hyungjun
 */
export interface SelectedImage {
  /** `images` 배열 기준 선택된 썸네일 인덱스 */
  index: number;
  /** 선택된 항목들 사이에서 사용자에게 보여 줄 순서(뱃지 등) */
  order: number;
}
