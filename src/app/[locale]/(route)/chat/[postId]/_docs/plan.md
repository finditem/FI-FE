# chat/[postId] 작업 계획

## 번역 버튼 로딩 스피너 + 메시지 블러 처리 (피그마 시안 반영)

- [x] ChatBox.tsx: 번역 버튼 로딩 중(`isTranslating`) 아이콘을 `MessageTranslate`에서 `Loading`(animate-spin)으로 교체
- [x] ExpandableMessageBubble.tsx: `isTranslating` prop 추가, 로딩 중 텍스트에 `blur-sm` 필터 적용 (오버레이 방식은 흰 버블이 배경색과 겹쳐 보여 폐기, 텍스트 직접 블러 처리로 변경)
- [x] ChatBox.tsx: ExpandableMessageBubble에 `isTranslating` prop 전달
- [x] `npm run test`, `npm run build` 통과 확인
