# chat/[postId] 작업 계획

## 번역 버튼 로딩 스피너 + 메시지 블러 처리 (피그마 시안 반영)

- [x] ChatBox.tsx: 번역 버튼 로딩 중(`isTranslating`) 아이콘을 `MessageTranslate`에서 `Loading`(animate-spin)으로 교체
- [x] ExpandableMessageBubble.tsx: `isTranslating` prop 추가, 로딩 중 버블 위에 블러 오버레이(`bg-fill-neutral-subtle-default` + `backdrop-blur-md`, 버블과 동일한 모서리) 표시
- [x] ChatBox.tsx: ExpandableMessageBubble에 `isTranslating` prop 전달
- [x] `npm run test`, `npm run build` 통과 확인
