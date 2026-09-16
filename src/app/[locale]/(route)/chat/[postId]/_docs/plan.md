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
- [x] 번역 횟수 차감/조회 실제 API 연동 — 아래 "실제 백엔드 번역 API 연동" 섹션으로 통합
- [x] 횟수 제한 도달 토스트(5-1): 상단 "번역 횟수를 모두 사용했어요.", 하단 "{N}시간 후 다시 사용할 수 있어요. 번역한 메시지는 계속 볼 수 있어요." (N 계산 로직 포함) — 아래 "횟수 제한 도달 바텀 토스트" 섹션에서 구현
- [ ] 채팅방 재진입 시 번역 상태가 원문으로 초기화되는지 검증 (현재 `useMessageTranslation`이 컴포넌트 로컬 state라 자연히 초기화될 가능성이 높으나 실제 확인 필요)
- [x] 실제 백엔드 번역 API 연동 — 아래 "실제 백엔드 번역 API 연동" 섹션으로 통합

## 번역 텍스트 "[번역됨]" 접두어 제거 (사용자 요청)

- [x] `mockTranslateMessage.ts`: `translatedPrefix` 파라미터 및 접두어 붙이는 로직 제거
- [x] `useMessageTranslation.ts`: `mockTranslateMessage` 호출부에서 `t("translatedPrefix")` 인자 제거
- [x] `ChatBox` 네임스페이스의 `translatedPrefix` 키를 ko.json/en.json에서 제거
- [x] `npm run test`, `npm run build` 통과 확인

## 횟수 제한 도달 바텀 토스트 (5-1, 피그마 node-id=14407-155822)

- [x] `getTranslationResetHours` 유틸 추가: 현재 시각에서 로컬 자정까지 남은 시간(시간 단위, 최소 1)을 반환. 일일 초기화 정책의 임시 계산이며, 백엔드 이용 이력 연동 시 실제 값으로 교체 예정
- [x] `useTranslationLimitToast`(zustand, 라우트 로컬) 스토어 추가: `isOpen` + `nonce`(재트리거 시 타이머 리셋용) + `open`/`close`
- [x] `TranslationLimitToast` 컴포넌트 추가 (`ChatRoomMain/_internal`): `bg-toast` 다크 배경 + 경고 아이콘 + 두 줄(제목/설명) 하단 토스트, `createPortal` + framer-motion, 3초 자동 해제. 시안 문구 사용(제목 "오늘 번역 횟수를 다 썼어요.")
- [x] `ChatRoomMain.tsx`에 `TranslationLimitToast` 렌더링
- [x] `useMessageTranslation.ts`: 신규 번역 시도 시 `usedCount >= DAILY_TRANSLATION_LIMIT`이면 번역하지 않고 `open()`으로 토스트 노출(이미 번역된 메시지 재확인은 제한 없이 허용)
- [x] `TranslationLimitToast` i18n 네임스페이스 키 ko/en 동시 추가 (`title`, `description` with `{hours}`)
- [x] `npm run lint:i18n-literal`, `npm run check:i18n-keys`, `npm run test`, `npm run build` 통과 확인

## 실제 백엔드 번역 API 연동 (다음 PR)

기존 mock/임시 zustand를 실제 API로 교체한다. `roomVisitId`, `requestId`는 프론트에서 생성해 전달하며(서버가 이 값으로 요청을 구분), `roomVisitId`는 채팅방 입장(마운트)당 1개를 재사용하고 `requestId`는 번역 시도마다 새로 생성한다. 확인된 계약:

- `POST /chats/{roomId}/messages/{messageId}/translations` — 바디 `{ requestId, roomVisitId, targetLanguage }`, 응답 `result: { originalText, translatedText, sourceLanguage, targetLanguage, usedCount, limit }`. 같은 `requestId`를 다른 메시지/입장/언어에 재사용하면 409.
- `GET /users/me/chat-translation-usage` — 응답 `result: { usedCount, limit, nextAvailableAt }` (매일 자정 Asia/Seoul 초기화)
- 응답 래퍼는 공통 `ApiBaseResponseType<T>`(`isSuccess`/`code`/`message`/`result`)

### API 훅/타입 (`src/api/fetch/chatMessage/`)

- [x] `types/MessageTranslationRequest.ts`, `types/MessageTranslationResponse.ts`, `types/ChatTranslationUsage.ts` 추가
- [x] `api/usePostMessageTranslation.ts` — `useAppMutation<MessageTranslationRequest, ApiBaseResponseType<MessageTranslationResponse>>("auth", URL, "post")`. `roomId`/`messageId`는 훅 인자로 URL에 넣고, `mutate`에는 DTO 바디만 전달
- [x] `api/useGetChatTranslationUsage.ts` — `useAppQuery("auth", ["chatTranslationUsage"], "/users/me/chat-translation-usage")`, `select`로 `result` 언랩
- [x] chatMessage 도메인은 배럴 `index.ts` 없이 직접 import하는 컨벤션이라 재-export 불필요 (기존 훅들과 동일하게 직접 import)

### roomVisitId / prop 연결

- [x] `roomVisitId` 생성: 채팅방 진입당 1개(`crypto.randomUUID()`, `useState` 초기화로 마운트 시 고정). `page.tsx`에서 생성해 `roomId`와 함께 하위로 전달 (재진입 시 리마운트 → 새 visit)
- [x] `ChatRoomMain`에 `roomId`, `roomVisitId` prop 추가 → `ChatBox`로 전달 (`messageId`는 `chat.messageId`로 이미 있음)

### useMessageTranslation 교체

- [x] 시그니처를 `{ roomId, messageId, roomVisitId, originalContent }`로 변경, `mockTranslateMessage` 대신 `usePostMessageTranslation` 호출. `isTranslating`은 mutation `isPending`으로 대체
- [x] `requestId`는 번역 시도마다 `crypto.randomUUID()`, `targetLanguage`는 현재 UI locale(`useLocale()` KO/EN)로 전달 (서버 선호언어로 위임할지 여부는 백엔드/기획 확인 후 조정 가능)
- [x] 성공 시 `result.translatedText` 반영 + `["chatTranslationUsage"]` 쿼리 무효화
- [x] 실패 처리: 서버 429(횟수 초과)는 제한 토스트, 그 외 에러는 기존 실패 토스트

### 임시 카운터/목업 제거 및 서버값 반영

- [x] `TranslationUsageBadge`: `useChatTranslationUsage`(zustand) 대신 `useGetChatTranslationUsage`의 `usedCount/limit` 사용 (로딩 전 폴백 20)
- [x] 제한 도달 판정: 서버 `usedCount >= limit` 기준으로 변경
- [x] `TranslationLimitToast` 남은 시간: 자정 계산 대신 서버 `nextAvailableAt` 사용 (`getTranslationResetHours`가 ISO 문자열 인자를 받고, 없으면 로컬 자정 폴백)
- [x] `useChatTranslationUsage`(임시 zustand), `mockTranslateMessage`(및 폴더) 제거
- [x] `npm run check:i18n-keys`, `npm run test`, `npm run build` 통과 확인

### 범위 밖 / 후속

- `preferred-language`(GET/PATCH) 설정 화면은 이 번역 기능과 별개(서버가 선호언어로 번역)라 이번 PR 범위에서 제외
- `roomVisitId` 클라이언트 생성 방식은 백엔드 확인 완료(서버가 값으로만 구분)
