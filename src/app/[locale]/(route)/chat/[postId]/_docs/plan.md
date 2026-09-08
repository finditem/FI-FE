# chat/[postId] 작업 계획

## 번역 버튼 로딩 스피너 + 메시지 블러 처리 (피그마 시안 반영)

- [x] ChatBox.tsx: 번역 버튼 로딩 중(`isTranslating`) 아이콘을 `MessageTranslate`에서 `Loading`(animate-spin)으로 교체
- [x] ExpandableMessageBubble.tsx: `isTranslating` prop 추가, 로딩 중 텍스트에 `blur-sm` 필터 적용 (오버레이 방식은 흰 버블이 배경색과 겹쳐 보여 폐기, 텍스트 직접 블러 처리로 변경)
- [x] ChatBox.tsx: ExpandableMessageBubble에 `isTranslating` prop 전달
- [x] `npm run test`, `npm run build` 통과 확인

## 원본보기(번역 완료) 상태 버튼 색상 반영 (피그마 시안 node-id=14407-155678)

- [x] `src/assets/message-translate-active.svg` 추가 — 번역 완료(원본보기) 상태용 아이콘, `icon-manifest.json`에 `MessageTranslateActive`로 등록 후 스프라이트 재생성
- [x] ChatBox.tsx: `isTranslated`일 때 버튼 배경을 `bg-fill-brand-strong-disabled`(#46c691)로, 아이콘을 `MessageTranslateActive`로 교체 (로딩 중이 아닐 때만)
- [x] `npm run test`, `npm run build` 통과 확인
