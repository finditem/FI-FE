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

## 범위 밖 / 후속

- 후기 등록 백엔드 API 연동 (Swagger 계약 확정 필요), 확정되면 `handleSubmit`에서 실제 등록 후 완료 팝업 오픈
- Figma API 재개 후 정확한 색상/간격 재검수 (아이콘 자산 자체는 위 섹션에서 반영 완료)
- 후기 작성 페이지 자체의 테스트(`ReviewWritePage.test.tsx` 등)는 이번 범위에서 작성하지 않음
- 완료 팝업 후 "채팅방 내 [후기 작성하기] 버튼 미노출" / "중복 작성 불가"(스펙 3-5)는 백엔드 필드 계약
  확인 후 반영
