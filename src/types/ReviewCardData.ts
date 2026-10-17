export interface ReviewCardData {
  id: string | number;
  avatarUrl?: string | null;
  nickname: string;
  location: string;
  /** ISO 날짜 문자열. `useFormatDate`로 상대 시간("30분 전")으로 변환됩니다. */
  createdAt: string;
  content: string;
  /** 카드에 노출되는 대표 태그 라벨 */
  tagLabel: string;
  /** 대표 태그 외 추가 태그 개수. 있으면 "+N" 배지로 표시됩니다. */
  extraTagCount?: number;
}
