# support 작업 계획

## 자주묻는질문(FAQ) 페이지 다국어(next-intl) 처리

- [x] `SupportTab/_internal/SUPPORT_TABS.ts`에서 한국어 `label` 필드 제거, `useSupportTabs` 훅 신설(`useTranslations("SupportTab")`)
- [x] `SupportTab.tsx`를 `useSupportTabs` 훅 사용으로 변경
- [x] `SupportFaqAccordion/_internal/FAQ_ITEMS.ts`에서 `question`/`answer`/`link.text` 한국어 텍스트 제거, `category`를 `SupportTabKey` 코드값으로 교체
- [x] `tabCategoryMap.ts` 삭제, `filterFaqItemsByTab`을 `supportFaqAccordionUtils.ts`로 이동하며 단순화(제네릭으로 변경), `_internal/index.ts` export 정리
- [x] `useFaqItems` 훅 신설(`useTranslations("SupportFaqAccordion")` + 카테고리 라벨은 `useSupportTabs` 재사용)
- [x] `SupportFaqAccordion.tsx`를 `useFaqItems` 훅 사용으로 변경, `aria-label` 번역 처리
- [x] `FloatingInquiryButton.tsx`에 `useTranslations("FloatingInquiryButton")` 적용
- [x] `layout.tsx`를 `generateMetadata`(`getTranslations("SupportLayout")`) + `useTranslations("SupportLayout")`로 전환
- [x] `src/messages/ko.json`/`en.json`에 `SupportLayout`/`SupportTab`/`SupportFaqAccordion`/`FloatingInquiryButton` 네임스페이스 추가
- [x] 관련 테스트(`SupportFaqAccordion.test.tsx`, `SupportTab.test.tsx`, `FloatingInquiryButton.test.tsx`)와 스토리 파일 확인 — 전역 next-intl mock/데코레이터로 코드 수정 없이 통과 확인
- [x] `npx jest`(246 스위트/1385 테스트 전체 통과)/`npx tsc --noEmit`(baseline 13개 외 신규 없음)/`npm run build`(ko/en 정적 생성 확인) 검증
