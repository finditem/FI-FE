# favorite-places 작업 계획

Figma `찜한 장소_Empty`(노드 `16364:160753`)와 `찜한 장소_컨텐츠`(노드 `16364:160769`)를 구현한다. 목록 API는 `GET /users/me/favorite-places`(cursor `lastFavoriteUpdatedAt`, `size` 최대 20)이고, 응답의 장소 항목은 홈의 `PlaceSummary`와 같다. 목록 카드와 상태 배지, 스켈레톤, 필터 칩 구성은 홈 동네 구경과 같으므로 전역으로 옮겨 함께 쓴다.

현재 API에는 `type` 필터와 `totalCount`가 없다. 백엔드에 추가를 요청했고, 프론트는 `type` 파라미터를 미리 보내고 `totalCount`가 있을 때만 개수 문구를 보여 준다. 해당 위치에 `TODO(준열)` 주석을 남긴다.

## 공통 컴포넌트 이동 (refactor)

- [x] `(home)/_components/NeighborhoodPlaceCard`를 `src/components/domain/PlaceCard`로 옮기고 홈 사용처 import를 바꾼다.
- [x] `PlaceStatusBadge`는 카드 밖에서도 쓰이는지 확인하고, 카드 내부 `_internal`로 함께 옮긴다. (카드에서만 쓰여 `_internal`로 옮겼다.)
- [x] `NeighborhoodPlaceCardSkeleton`을 `src/components/domain/PlaceCardSkeleton`으로 옮기고 홈 사용처 import를 바꾼다.
- [x] 홈 `NeighborhoodSection`의 필터 옵션(`FILTERS`)을 `src/constants/PLACE_FILTER_OPTIONS.ts`로 옮긴다.
- [x] 번역: 카드와 배지 문구(`statusOpen` 등, `openAt`, `favoriteAriaLabel`)를 `PlaceCard` 네임스페이스로, 필터 라벨을 `PlaceFilter` 네임스페이스로 옮긴다. ko/en 동시 수정.
- [x] 카드 스토리(`NeighborhoodPlaceCard.stories.tsx`) 이동은 test 브랜치에서 한다.

## API 훅

- [x] `src/api/fetch/user/types`에 `FavoritePlacesResponseType` 추가(`places`, `hasNext`, `nextFavoriteUpdatedAt`, 백엔드 추가 예정인 `totalCount`).
- [x] `src/api/fetch/user/api/useGetUserMeFavoritePlaces` 추가. `useAppInfiniteQuery`에 `pageParamName: "lastFavoriteUpdatedAt"`, `hasNext` 기반 `getNextPageParam`을 쓰고 `type`을 쿼리 파라미터로 보낸다.
- [x] `usePlaceFavorite`의 `onSettled`에서 찜한 장소 목록 캐시도 무효화해 찜 해제 후 목록이 갱신되게 한다.

## 페이지

- [x] 번역 네임스페이스 정하기: `MypageFavoritePlacesLayout`(title, description), `MypageFavoritePlacesPage`(title, srOnlyTitle), `MypageFavoritePlacesContent`(totalCount, loadError, srOnlyTitle), `MypageEmptyUI.favoritePlaces`(heading, body).
- [x] `layout.tsx` 작성 — `generateMetadata`로 title, description 설정 (`favorites/layout.tsx` 패턴).
- [x] `page.tsx` 작성 — `DetailHeader` + `h1 sr-only` + 컨텐츠 컴포넌트 (`favorites/page.tsx` 패턴).
- [x] `_components/MypageFavoritePlacesContent` 작성 — 개수 문구, 필터 칩, `PlaceCard` 목록, 무한 스크롤(`useInfiniteScroll`), 로딩 스켈레톤, 빈 상태.
- [x] `MypageEmptyUI`에 `favoritePlaces` 타입 추가(`PlaceMarker` 아이콘).
- [x] `npm run lint:i18n-literal`, `npm run check:i18n-keys` 통과 확인.

## 마이페이지 연결

- [x] 마이페이지 아이콘 탭의 찜한 장소 링크 TODO를 정리한다(`/mypage/favorite-places`).

## 검증과 테스트 (test 브랜치)

- [ ] `npm run test` + `npm run build`로 검증한다.
- [x] 카드 스토리 이동, 컨텐츠 컴포넌트 테스트와 스토리 추가는 별도 test 브랜치에서 한다. (컨텐츠는 API 의존이 커서 스토리 대신 jest 테스트 7건으로 검증했다.)

## 백엔드 대기

- [ ] `GET /users/me/favorite-places`에 `type` 파라미터와 `totalCount` 응답 필드가 추가되면 TODO를 정리한다.
- [ ] 칩을 바꿨을 때 개수 문구가 필터 결과를 따를지 전체 개수로 고정할지 디자이너에게 확인한다.
