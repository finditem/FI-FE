# write/review/[roomId] 작업 계획

채팅 상세페이지에서 "분실물 찾기 완료" → `PostFoundConfirmModal`의 "후기 남기기" 클릭 시 진입하는
찾길 후기 작성 페이지. 라우팅 주소는 `/write/review/[roomId]`로 결정(사용자 확인 완료) — 한 게시글에
여러 채팅방이 있을 수 있어 리뷰 대상(상대방)을 postId만으로는 특정할 수 없고, roomId가 채팅방(=상대방)을
정확히 가리킨다.

Figma API 호출 한도로 `get_design_context`를 못 쓰는 상태라, 사용자가 직접 첨부한 스크린샷(찾길 후기 /
찾길 후기_선택 프레임)을 시각 참고 자료로 삼아 구조만 우선 구현한다. 정확한 디자인 토큰(색상/간격 등)은
Figma API 재개 후 별도로 다듬는다.

전체 기획 스펙(찾기 완료 → 후기 작성 유도 → 후기 작성 3-1~3-5): [`chat/[postId]/_docs/manner-temperature-spec.md`](../../../chat/%5BpostId%5D/_docs/manner-temperature-spec.md).
후기 작성 완료 팝업(3-5)과 후기 등록 API 연동은 이 스펙이 나온 시점 기준으로도 여전히 미착수 —
"범위 밖 / 후속" 섹션 참고.

## 라우트 스켈레톤

- [x] `page.tsx`: `roomId` params 검증(숫자 아니면 notFound) 후 `ReviewWritePage` 렌더
- [x] `_components/ReviewWritePage/ReviewWritePage.tsx`: `DetailHeader`(title="찾길 후기") +
      인사말("{내 닉네임}님, {상대 닉네임}와의 만남은 어떠셨나요?") + 감정 선택 + 도움 체크리스트 +
      후기 텍스트(`InputField`, 300자) + 하단 고정 제출 버튼
  - 닉네임은 `useGetChatRoom({ roomId })`(상대), `useGetUsersMe()`(나)로 실제 연동
- [x] `_components/ReviewWritePage/_internal/ReviewFeelingSelect`: 감동/감사/심쿵 3개 중 단일 선택,
      로컬 상태로만 관리(백엔드 계약 없음)
- [x] `_components/ReviewWritePage/_internal/ReviewHelpChecklist`: 도움 체크리스트 5개 다중 선택(`CheckBox`
      재사용), 로컬 상태로만 관리
- [x] 제출 버튼: 백엔드 후기 등록 API가 아직 없어 실제 제출은 다음 작업으로 남기고, 이번엔 필수값(감정 선택)
      미충족 시 비활성화까지만 구현 (클릭 핸들러는 아직 없음 — 다음 작업에서 API 연동과 함께 추가)

## 연결 지점

- [x] `PostFoundConfirmModal`에 `roomId?: number` prop 추가. `roomId`가 있으면(채팅 상세에서 연 경우)
      "후기 남기기" 클릭 시 상태 변경 후 `/write/review/${roomId}`로 이동. `roomId`가 없으면(게시글 상세
      PostActionMenu에서 연 경우, 특정 채팅방이 없어 리뷰 대상 불명) 기존처럼 상태 변경만 수행
- [x] `ChatRoomHeaderInfoButton.tsx`: `PostFoundConfirmModal`에 `roomId={roomId}` 전달

## i18n

- [x] 네임스페이스 `ReviewWritePage` (ko/en 동시 추가): title, greeting({myNickname}/{opponentNickname}
      placeholder 포함), feelings(touched/grateful/heartFlutter), helpQuestion, helpItems(5개),
      reviewLabel, reviewPlaceholder, submitLabel
- [x] `npm run lint:i18n-literal`, `npm run check:i18n-keys` 통과 확인

## 검증

- [x] `npm run test`, `npm run build` 통과 확인

## 감정 선택 아이콘 반영 (매너온도 3차 스프린트)

사용자가 직접 첨부한 SVG(`touched.svg`/`thanks.svg`/`heart-skipped.svg`)를 스프라이트에 등록해
빈 원이었던 감정 선택 UI에 실제 아이콘을 넣었다. 원본 fill이 `#D9D9D9`라 스프라이트 생성 스크립트가
자동으로 `currentColor`로 치환하는 대상이었고, 이를 `text-labelsVibrant-quaternary`(값도 동일하게
`#d9d9d9`) 토큰으로 명시해 하드코딩 없이 디자인 토큰에 연결했다.

- [x] `src/assets/`에 `touched.svg`(감동) / `thanks.svg`(감사) / `heart-skipped.svg`(심쿵) 추가,
      `icon-manifest.json`에 `Touched`/`Grateful`/`HeartFlutter`로 등록 후 스프라이트 재생성
- [x] `ReviewFeelingSelect.tsx`: `FEELING_ICON` 매핑 추가, 원형 버튼을 `size-[88px]` +
      `bg-fill-neutralInversed-normal-default` + `flex-center`로 변경(기존 `size-16` 빈 원에서 확대),
      내부에 `<Icon size={48} className="text-labelsVibrant-quaternary" />` 중앙 배치
- [x] 원형 버튼 간 간격 `gap-6` → `gap-9`(36px)로 변경
- [x] `npm run build` 통과 확인 (해당 컴포넌트 전용 테스트 파일은 아직 없어 build로만 검증)

## 후기 작성 완료 팝업 (매너온도 3차 스프린트, 피그마 node-id=16364-160405, 스펙 3-5)

"후기 남기기" 클릭 시 노출되는 완료 팝업을 퍼블리싱했다. 백엔드 후기 등록 API가 아직 없어 실제 등록은
생략하고, 클릭 시 로컬 상태로 팝업만 연다. API 연동 시 제출 성공 콜백에서 팝업을 열도록 교체하면 된다.

- [x] `ReviewWritePage/_internal/ReviewCompleteModal/ReviewCompleteModal.tsx` 신규 — `ModalLayout` 기반,
      일러스트 + 타이틀(2줄) + 설명 + 단일 outlined 버튼("후기 작성 완료"). props는 `{ isOpen, onConfirm }`,
      백드롭/ESC도 `onConfirm`으로 처리
- [x] `ReviewWritePage.tsx`: `isCompleteOpen` 상태 추가, 제출 버튼 `onClick={handleSubmit}`으로 팝업 오픈,
      "후기 작성 완료" 클릭 시 `router.back()`으로 이전 화면 이동(스펙 3-5)
- [x] i18n: `ReviewCompleteModal` 네임스페이스(`title`/`description`/`confirmLabel`) ko/en 동시 추가
- [x] `npm run check:i18n-keys`, `npm run lint:i18n-literal`, `npm run test`(1444개) 통과 확인
- [x] 상단 일러스트를 사용자 첨부 자산 `review-thanks.svg`로 교체. `<pattern>` + 임베드 래스터 구조라
      스프라이트(`<use>` 클로닝) 대신 `iconImports`에 동적 등록(`ReviewThanks`), `NoComments` 등 다른
      일러스트와 동일하게 `<Icon size={88} />`로 렌더(89x84 비정사각이라 미세한 정사각 보정 발생, 기존
      일러스트 처리 방식과 동일)
- [ ] 버튼 문구: Figma 레이어 텍스트는 "작성 후기 완료"이나 어순 오타로 판단해 스펙 문구 "후기 작성 완료"로
      반영함 — 확정 필요

## 필수/선택 표기 (매너온도 3차 스프린트)

- [x] 인사말("~만남은 어떠셨나요?")과 도움 질문("어떤 도움을 받으셨나요?") 헤딩 끝에 필수 표시 `*`를
      `text-system-success` 색으로 인라인 추가 (감정 유형·도움 경험이 필수 입력이므로)
- [x] 후기 입력 라벨에 "(선택)" 문구를 `text-h2-regular`로 덧붙임. `InputField`/`Label`의 `label` prop을
      `string`에서 `ReactNode`로 확장해 서로 다른 굵기의 라벨을 주입(문자열도 ReactNode라 다른 사용처
      2곳은 영향 없음). i18n `ReviewWritePage.reviewOptional`(ko/en) 추가

## 감정 선택 UI 디자인 변경 (Talk to Figma `찾길 후기_M` / `찾길 후기_선택_M`)

감정 선택 UI를 스프라이트 SVG 아이콘(`Touched`/`Grateful`/`HeartFlutter`, `currentColor` 단색)에서
상태별 유령 일러스트 PNG로 교체한다. 디자이너가 미선택(흑백)과 선택(컬러) 그림을 각각 별도 PNG로 제공해,
CSS 채도 필터 없이 선택 상태에 따라 이미지 소스만 교체한다.

- [x] `public/review/feeling/`에 PNG 6종 배치(감정별 default/selected): touched, grateful, heart-flutter
- [x] `ReviewFeelingSelect.tsx`: `Icon` 제거하고 `next/image`로 교체. 감정별 `{ default, selected }`
      이미지 경로 매핑 상수로 분리, 선택 상태에 따라 소스 전환
- [x] 원형 배경색: 미선택 `bg-fill-neutralInversed-normal-default`(#f5f5f5) 유지, 선택은
      `[Fill]/Brand/Normal/Default` 토큰인 `bg-fill-brand-normal-default`(rgba(30, 184, 123, 0.7))로 변경
- [x] 라벨 색: 미선택 `text-labelsVibrant-secondary`(#999999), 선택 `text-brand-normal-default`(#0aa874)
- [x] 이미지 표시 크기 45x60(원본 90x120의 1/2) 중앙 배치
- [x] `npm run build` 통과 확인(해당 컴포넌트 전용 테스트 없음)
- [x] PR 전체 변경분과 후기 작성 페이지의 하드코딩 색상 및 원시 팔레트 사용 여부 재점검
- [x] Prettier, `git diff --check`, i18n 키 검사, 관련 테스트 및 빌드 재검증
- [ ] 미사용이 된 스프라이트 아이콘(`Touched`/`Grateful`/`HeartFlutter` = `touched.svg`/`thanks.svg`/
      `heart-skipped.svg`) 정리는 전역 스프라이트 재생성이 필요해 이 PR 범위 밖. 별도 `asset` 작업으로 분리
- [ ] 실행 중이던 dev 서버는 `public/review/` 폴더가 서버 시작 후 추가돼 로컬에서 404. dev 재시작 필요
      (프로덕션 빌드에는 정상 포함)

## 후기 작성 완료 팝업 일러스트 교체 (사용자 첨부 `thanks.png`)

기존 `review-thanks.svg`(pattern + 임베드 래스터, 89x84 비정사각 보정 필요했던 자산)를 사용자가 새로
전달한 하트 일러스트 PNG(152x144)로 교체했다. 단일 정적 일러스트라 스프라이트/`iconImports` 동적 등록
없이 감정 선택 아이콘과 동일하게 `next/image` + `public/` 경로 방식으로 전환했다.

- [x] `public/review/review-thanks.png` 추가
- [x] `ReviewCompleteModal.tsx`: `Icon name="ReviewThanks"` 제거, `next/image`로 교체
      (width=93 height=88, 원본 152x144 비율 유지)
- [x] 미사용이 된 `ReviewThanks` 등록(`src/components/common/Icon/index.ts`)과 원본 자산
      `src/assets/review-thanks.svg` 삭제
- [x] `npm run build` 통과 확인

## 후기 작성 완료 팝업 2차 퍼블리싱 (Talk to Figma `찾길 후기_선택_완료팝업_M`, node 16948:136043)

완료 팝업이 단일 버튼(outlined, 전체 폭 "후기 작성 완료")에서 2버튼 레이아웃으로 변경됐다. 좌측
"확인"(outlined, 기존 화면으로 복귀)과 우측 "보낸 후기 보기"(solid 브랜드 그린, 보낸 후기 탭으로 이동)로
액션이 분리됐다. 일러스트는 기존 `review-thanks.png`(152x144)와 동일 자산으로 보이며, 이 모달에서는
더 작게(76x72) 표시된다.

- [x] `ReviewCompleteModal.tsx`: props를 `{ isOpen, onConfirm, onViewSentReview }`로 확장
- [x] 액션 영역을 2버튼 레이아웃으로 교체: `Button variant="outlined" size="big"`(확인, hug-width) +
      `Button ignoreBase`(보낸 후기 보기, flex-1, `bg-fill-brand-strong-default`(#00b76e) 풀 오퍼시티 +
      흰 텍스트 — 공용 `Button`의 solid 기본 스타일은 70% 오퍼시티라 Figma와 안 맞아 `ignoreBase`로 직접
      스타일링함)
- [x] 일러스트 표시 크기 93x88 → 76x72 (원본 152x144 비율 유지, 이 모달 기준으로 더 작게)
- [x] `ReviewWritePage.tsx`: `handleViewSentReview` 추가 — 모달 닫고
      `router.push("/mypage/reviews?tab=sent")`로 보낸 후기 탭 이동 (`useReviewTabQuery`의 쿼리 규약과 일치)
- [x] i18n `ReviewCompleteModal`: title을 "찾길과 함께 → 우리 동네에서"로 변경(description은 기존과
      동일), `confirmLabel`을 "후기 작성 완료" → "확인"으로 변경, `viewSentReviewLabel`(ko/en) 신규 추가
- [x] `npm run check:i18n-keys`, `npm run build` 통과 확인

## 이미지 최적화: PNG → WebP 변환 (PR #1303 리뷰 반영)

리뷰어 요청으로 `public/review/` 하위 PNG 7개(감정 선택 6개 + 완료 팝업 일러스트)를 WebP로 변환했다.

- [x] `sharp`(quality 90)로 전부 변환, 원본 PNG는 삭제(중복 보관 안 함)
- [x] `ReviewFeelingSelect.tsx`/`ReviewCompleteModal.tsx`의 `next/image` `src` 경로를 `.webp`로 교체
- [x] 전체 용량 102.2K → 32.5K (-68.2%), 화질 손상 없음(육안 확인)
- [x] `npm run build` 통과 확인

## 로케일 보존 라우터로 교체 (PR #1303 Codex 리뷰 반영)

"보낸 후기 보기" 클릭 시 `next/navigation`의 `useRouter`로 `/mypage/reviews?tab=sent`에 푸시하면,
영어(`/en/...`) 사용자가 클라이언트 라우팅으로 이동할 때 로케일 접두사가 없는 주소라 한국어로
전환되는 문제가 있었다(접두사 없는 주소는 `localeDetection: false`로 항상 한국어 고정).

- [x] `useRouter` import를 `next/navigation` → `@/i18n/navigation`(next-intl `createNavigation` 래퍼)로
      교체. `router.back()`/`router.push()` 호출부 변경 없이 현재 로케일을 자동으로 유지
- [x] `npm run build` 통과 확인

## 후기 등록 API 연동 (POST /reviews)

Swagger(`https://dev-api.finditem.kr/swagger-ui/index.html#/Review/write`) 계약 확정에 따라 실제 등록
연동. `findCompletionId`는 채팅방 상세(`findCompletion.findCompletionId`)에서 가져온다.

- [x] `src/api/fetch/chatRoom/types/ChatRoomResponse.ts`: `FindCompletionInfo`(`status`/`findCompletionId`/
      `canComplete`/`canWriteReview`) 타입 추가, `ChatRoomResponse.findCompletion` 필드로 연결
      (백엔드 `ChatRoomResultDTO.findCompletion`과 계약 일치)
- [x] `src/api/fetch/review/` 도메인 신규 생성 — `types/ReviewCreateType.ts`(`ReviewEmotionType`/
      `ReviewHelpType`/`ReviewCreateRequest`/`ReviewIdResponse`), `api/usePostReview.ts`(`useAppMutation`
      기반, 성공 시 `chatRoomDetail` 쿼리 무효화 + `onSuccess` 콜백, 에러는 `REVIEW409-ALREADY_WRITTEN`만
      별도 토스트 분기 후 나머지는 공통 에러 토스트), `index.ts`
- [x] `ReviewWritePage.tsx`: `handleSubmit`에서 실제 `usePostReview` 호출로 교체. 로컬 UI 값
      (`ReviewFeelingValue`/`ReviewHelpItemValue`)을 백엔드 enum으로 변환하는 `EMOTION_REQUEST_MAP`/
      `HELP_TYPE_REQUEST_MAP` 추가. `findCompletionId`가 없으면(채팅방 응답 아직 없음/이 방에서 완료
      처리 안 됨) 제출 버튼 비활성화. 제출 중(`isPending`)에도 비활성화해 중복 제출 방지. 성공 콜백에서
      완료 팝업 오픈(기존 TODO 제거). `findCompletion`은 옵셔널 체이닝으로 접근(백엔드 미반영 시 방어)
- [x] `canWriteReview`도 `canSubmit`/`handleSubmit` 가드에 반영 — `findCompletionId`가 남아 있어도 이미
      후기를 작성한 경우 등은 `canWriteReview: false`라 제출 버튼을 비활성화해야 재방문 시
      `REVIEW409-ALREADY_WRITTEN`로만 막히는 폼이 노출되지 않는다
- [x] i18n: `usePostReview` 네임스페이스(`alreadyWritten`/`submitError`) ko/en 동시 추가

### 선행: 찾기 완료 처리 API 연동 (라우트 밖 / 공통·채팅 도메인)

후기 작성의 `findCompletionId`는 "찾기 완료" 처리 시 발급된다. 기존 찾기 완료 플로우가
`PUT /posts/{postId}/status`(게시글 상태만 변경)만 호출해 `findCompletionId`가 생성되지 않던 문제를
`POST /chats/{roomId}/find-completion` 연동으로 해결. 이 변경은 `src/components/domain`(공통)과
`src/api/fetch/chatRoom`(채팅 도메인)에 걸쳐 write/review 라우트 범위 밖이라 여기서는 참고로만 기록한다.

- [x] `src/api/fetch/chatRoom/api/usePostFindCompletion.ts` 신규(응답 `FindCompletionResponse`),
      성공 시 채팅방 상세/게시글 캐시 무효화 → 후기 페이지 진입 시 최신 `findCompletion` 반영
- [x] `PostFoundConfirmModal`: `roomId`가 있으면(채팅 상세) `find-completion` 호출로 전환,
      없으면(게시글 상세) 기존 `PUT status` 유지. 기존 테스트도 바뀐 동작에 맞춰 갱신
- [x] i18n: `usePostFindCompletion` 네임스페이스(`completeSuccess`/`alreadyCompleted`/`completeError`)

## 범위 밖 / 후속

- Figma API 재개 후 정확한 색상/간격 재검수 (아이콘 자산 자체는 위 섹션에서 반영 완료)
- 후기 작성 페이지 자체의 테스트(`ReviewWritePage.test.tsx` 등)는 이번 범위에서 작성하지 않음
- 완료 팝업 후 "채팅방 내 [후기 작성하기] 버튼 미노출"은 `findCompletion.canWriteReview` 필드가 타입에는
  추가됐으나 채팅 쪽 UI에서 아직 소비하지 않음 — 채팅 상세 작업 시 반영
