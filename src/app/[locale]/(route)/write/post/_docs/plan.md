# write/post 작업 계획

로드맵 4단계(로그인 후 핵심 플로우) 첫 페이지: write/post(작성), write/post/[id](수정), write/post/location(위치 지정) 영어 번역.

## 커밋 1 — 작성 페이지

- [ ] `page.tsx`의 `generateMetadata`를 `getTranslations("PostWritePage")`로 전환
- [ ] `useWritePageType.ts`에 `useTranslations("useWritePageType")` 적용
- [ ] `WriteForm.tsx`에 `useTranslations("WriteForm")` 적용 (sr-only, 이미지 미첨부 확인 모달 4문구)
- [ ] `TitleSection.tsx`에 `useTranslations("TitleSection")` 적용
- [ ] `ContentSection.tsx`에 `useTranslations("ContentSection")` 적용
- [ ] `CategorySection.tsx`에 `useTranslations("CategorySection")` 적용 (`getItemCategoryLabel` 호출부는 제외)
- [ ] `LocationSection.tsx`에 `useTranslations("LocationSection")` 적용
- [ ] `messages/ko.json`/`messages/en.json`에 위 네임스페이스 추가
- [ ] `npx jest` / `npx tsc --noEmit` 검증

## 커밋 2 — 게시글 수정 페이지

- [ ] `PostEditPage.tsx`에 `useTranslations("PostEditPage")` 적용
- [ ] `PostEditSkeleton.tsx`에 `useTranslations("PostEditSkeleton")` 적용
- [ ] `messages/ko.json`/`messages/en.json`에 네임스페이스 추가
- [ ] `npx jest` / `npx tsc --noEmit` 검증

## 커밋 3 — 위치 등록 페이지

- [ ] `location/layout.tsx`를 async + `getTranslations("PostWriteLocationLayout")`로 전환
- [ ] `LocationSearchSection.tsx`에 `useTranslations("LocationSearchSection")` 적용 (`LocationGuideUI` 포함)
- [ ] `LocationRangeSection.tsx`에 `useTranslations("LocationRangeSection")` 적용
- [ ] `BottomSheet.tsx`에 `useTranslations("PostWriteBottomSheet")` 적용
- [ ] `messages/ko.json`/`messages/en.json`에 네임스페이스 추가
- [ ] `npx jest` / `npx tsc --noEmit` / `npm run build` 최종 검증

## 스코프 제외 (참고, 수정 안 함)

- `inquiry-write`, `list/[id]`, `mypage/posts`
- `getItemCategoryLabel`/`getItemStatusLabel` 공유 유틸
- `PostWriteType.ts`의 zod 에러 메시지 (렌더링되지 않는 내부 메시지)
- `TempModal.tsx`/`useTempPostModal`/`useTempPostActions` (죽은 코드)
- `DISTANCE_OPTIONS.ts`의 km 라벨 (언어중립)
