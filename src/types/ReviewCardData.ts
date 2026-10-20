/**
 * 후기 카드(ReviewCard)에 표시되는 데이터 타입입니다.
 *
 * @author suhyeon
 */
export interface ReviewCardData {
  /** 후기 ID. `ReviewListItem.reviewId`와 매핑됩니다. */
  id: number;
  /** 후기 작성자 프로필 이미지 URL. 등록하지 않았거나 탈퇴한 사용자는 `null`입니다. */
  avatarUrl?: string | null;
  /** 후기 작성자 닉네임. 탈퇴한 사용자는 호출 측에서 대체 문구로 채웁니다. */
  nickname: string;
  /** 작성자 동네(지역) 표시 텍스트. 아직 후기 목록 API 응답에 없어 더미 데이터에만 채워져 있습니다. */
  location?: string;
  /** ISO 날짜 문자열. `useFormatDate`로 상대 시간("30분 전")으로 변환됩니다. */
  createdAt: string;
  /** 후기 본문. 입력하지 않았으면 `null`입니다. */
  content?: string | null;
  /** 카드에 노출되는 대표 태그 라벨 */
  tagLabel: string;
  /** 대표 태그 외 추가 태그 개수. 있으면 "+N" 배지로 표시됩니다. */
  extraTagCount?: number;
}
