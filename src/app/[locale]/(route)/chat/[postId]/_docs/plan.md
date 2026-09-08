# chat/[postId] 작업 계획

전체 기획 스펙: [`./spec.md`](./spec.md) (채팅 메시지 번역 — 실패 처리, 횟수 제한, 상태 유지 정책 등)

## 번역 버튼 로딩 스피너 + 메시지 블러 처리 (피그마 시안 반영)

- [x] ChatBox.tsx: 번역 버튼 로딩 중(`isTranslating`) 아이콘을 `MessageTranslate`에서 `Loading`(animate-spin)으로 교체
- [x] ExpandableMessageBubble.tsx: `isTranslating` prop 추가, 로딩 중 텍스트에 `blur-sm` 필터 적용 (오버레이 방식은 흰 버블이 배경색과 겹쳐 보여 폐기, 텍스트 직접 블러 처리로 변경)
- [x] ChatBox.tsx: ExpandableMessageBubble에 `isTranslating` prop 전달
- [x] `npm run test`, `npm run build` 통과 확인

## 원본보기(번역 완료) 상태 버튼 색상 반영 (피그마 시안 node-id=14407-155678)

- [x] `src/assets/message-translate-active.svg` 추가 — 번역 완료(원본보기) 상태용 아이콘, `icon-manifest.json`에 `MessageTranslateActive`로 등록 후 스프라이트 재생성
- [x] ChatBox.tsx: `isTranslated`일 때 버튼 배경을 `bg-fill-brand-strong-disabled`(#46c691)로, 아이콘을 `MessageTranslateActive`로 교체 (로딩 중이 아닐 때만)
- [x] `npm run test`, `npm run build` 통과 확인

## 채팅 번역 스펙 반영 (spec.md, 미착수)

- [x] 번역 실패 케이스 처리: `mockTranslateMessage`에 실패(reject) 분기 추가, `useMessageTranslation`에 try/catch/finally로 실패 시 원문 유지 + `isTranslating` 정상 해제 + 번역 아이콘으로 재시도 가능하게 유지
- [x] 실패 토스트: 기존 `useToast`(`addToast(message, "error")`) 재사용, `ChatBox.translateError` i18n 키 추가 (ko/en, 3초 노출은 ToastProvider에 이미 고정 구현됨)
- [x] 번역 횟수 표시 UI: `TranslationUsageBadge` 컴포넌트 추가, "오늘 번역 N/20 사용" 배지를 메시지 목록 하단에 표시 (피그마 node-id=14407-155696). 카운트는 `useChatTranslationUsage`(zustand, 세션 한정 임시 스토어)로 관리하며 번역 성공 시에만 증가
- [ ] 번역 횟수 차감/조회 실제 API 연동 — 현재 `useChatTranslationUsage`는 새로고침/재진입 시 초기화되는 클라이언트 전용 임시 카운터. 계정 단위로 서버에 영속화된 실제 횟수로 교체 필요
- [ ] 횟수 제한 도달 토스트(5-1): 상단 "번역 횟수를 모두 사용했어요.", 하단 "{N}시간 후 다시 사용할 수 있어요. 번역한 메시지는 계속 볼 수 있어요." (N 계산 로직 포함)
- [ ] 채팅방 재진입 시 번역 상태가 원문으로 초기화되는지 검증 (현재 `useMessageTranslation`이 컴포넌트 로컬 state라 자연히 초기화될 가능성이 높으나 실제 확인 필요)
- [ ] 실제 백엔드 번역 API 연동 — `mockTranslateMessage` 호출부를 `useAppMutation` 기반 훅으로 교체, 사용자 설정 언어(`useGetPreferredLanguage`) 반영
