# user/[userId] 작업 계획

- [x] 타인 프로필 페이지의 한국어 및 영어 번역 메시지를 정의한다.
- [x] 타인 프로필 페이지 컴포넌트와 메타데이터에 다국어 처리를 적용한다.
- [x] 번역 변경에 맞춰 타인 프로필 페이지 테스트를 갱신하고 검증한다.

## 받은 후기 탭 추가 (마이페이지 받은 후기 PR #1278 참고, 퍼블리싱 중심)

- [x] `ReviewCard`(`mypage/reviews/_components/_internal`)를 `src/components/domain/ReviewCard`로 승격하고, 후기 숨기기 케밥 메뉴를 `showHideMenu` prop으로 조건부 렌더하도록 수정한다.
- [x] `ReviewCardData` 타입(`mypage/reviews/_types`)을 `src/types/ReviewCardData.ts`로 승격한다.
- [x] 마이페이지 받은 후기(`ReviewsContent`, `MOCK_RECEIVED_REVIEWS`)가 승격된 `ReviewCard`/`ReviewCardData`를 가리키도록 import 경로를 갱신한다.
- [x] `_types/UserProfileTabType.ts`에 `"reviews"` 탭 키를 추가한다.
- [x] `useUserProfileTabQuery`가 API 전용 `UserTabType` 대신 라우트 로컬 `UserProfileTabKey`를 기준으로 쿼리스트링을 동기화하도록 수정한다(`reviews`는 백엔드 `type` 파라미터에 없는 값이라 분리 필요).
- [x] `reviews` 탭에서도 프로필 메타데이터와 사용자 오류를 확인하도록 최초 프로필 요청은 유지하고, 포스트/댓글/즐겨찾기의 추가 페이지 요청만 건너뛴다.
- [x] `UserProfileView.tsx`의 tabs 배열에 "받은 후기" 탭을 추가하고 무한 스크롤 분기를 적용한다.
- [x] `TabContents.tsx`에 `reviews` 탭 분기를 추가한다 — 더미 데이터(`_constants/MOCK_RECEIVED_REVIEWS.ts`) 기반 `ReviewCard` 목록 또는 `EmptyState`, 하이드레이션 안전을 위한 mount 게이트 포함.
- [x] 타인페이지용 받은 후기 더미 데이터(`_constants/MOCK_RECEIVED_REVIEWS.ts`)를 작성한다(실제 API 없음, TODO 주석 포함).
- [x] 번역 키 추가: `UserProfilePage.tabs.reviews`, `UserProfilePage.empty.reviewsTitle`/`reviewsDescription` (ko/en).
- [x] 변경된 기존 컴포넌트(`TabContents`, `UserProfileView`)의 테스트/스토리를 갱신한다. 신규 컴포넌트는 없으므로(모두 기존 파일 수정) 별도 PR 분리 대상 없음.
- [x] `npm run lint:i18n-literal`, `npm run check:i18n-keys`, `npm run test`, `npm run build` 로컬 검증.

## 받은 후기 탭 실제 API 연동 (GET /users/{userId}/page?type=REVIEWS)

- [x] `UserProfileIdDataType`에 `reviews: ReviewListItem[]`를 추가하고, `UserProfileItem` 유니온에 `ReviewListItem`을 포함한다(`@/api/fetch/review`의 `ReviewListItem` 재사용).
- [x] `UserDataType`의 `UserTabType`/`UserUpperTabType`에 `reviews`/`REVIEWS`를 추가한다.
- [x] `useGetUserProfileById`의 `select`에 `REVIEWS` 분기를 추가해 `r.reviews`를 반환한다.
- [x] `UserProfileView.tsx`에서 `reviews`를 더 이상 비 API 탭으로 분리하지 않고, 네 탭 모두 API 조회와 무한 스크롤을 공유하도록 `isApiTab` 특수 처리를 제거한다.
- [x] `TabContents.tsx`의 `reviews` 분기를 더미/마운트 게이트 대신 실제 목록 데이터로 교체하고, `ReviewListItem`을 `ReviewCardData`로 매핑한다(도움 경험 라벨 i18n 매핑 포함, `showHideMenu={false}`).
- [x] 더 이상 쓰지 않는 `_constants/MOCK_RECEIVED_REVIEWS.ts`를 제거한다.
- [x] 번역 키 추가: `UserProfilePage.helpItems.*`, `UserProfilePage.withdrawnUser` (ko/en).
- [ ] `npm run lint:i18n-literal`, `npm run check:i18n-keys`, `npm run build` 로컬 검증. (기존 컴포넌트 테스트/스토리 갱신은 별도 `test/*` PR로 분리)
