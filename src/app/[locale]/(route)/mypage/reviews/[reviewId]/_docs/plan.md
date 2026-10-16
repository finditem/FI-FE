# [reviewId] 작업 계획

받은 후기 편지 상세 페이지(`/[locale]/mypage/reviews/[reviewId]`) 퍼블리싱. 첨부 캡처를 시각 기준으로, 기존 디자인 토큰과 공통 컴포넌트를 우선 재사용해 레이아웃/겹침/타이포/색상/그림자/하단 버튼을 다듬는다.

## 분석

- [x] 라우트 구조, 기존 구현, 공통 컴포넌트(Button/Chip/ProfileAvatar/Icon/FooterButton), 디자인 토큰 확인
- [x] 캡처와 현재 구현 비교, 하위 경로라 글로벌 Footer가 숨겨짐을 확인(하단 CTA 충돌 없음)

## 퍼블리싱 다듬기

- [x] 히어로(layout.tsx): 캐릭터 placeholder 정돈 + 핑크 하트 장식 추가, 칩/메시지 간격·타이포 정리
- [x] 후기 카드(ReviewLetterDetail): 카드 전체 라운드/초록 영역 겹침/내부 간격 정리
- [x] 편지 본문 배경을 토큰(`bg-layoutBrand`)으로 교체
- [x] 프로필 상태 뱃지를 `SendArrow` 아이콘으로 교체
- [x] 장점 목록 체크 표식을 `Check` 아이콘으로 교체
- [x] 하단 CTA를 공통 `Button`(variant auth)로 교체, 고정 래퍼를 프로젝트 관례(max-w-[764px])에 맞춤

## i18n

- [x] 네임스페이스: 기존 `ReviewDetailPage` / `ReviewDetailLayout` 유지, 하드코딩 날짜를 `sender.date` 키로 분리
- [x] ko.json / en.json 동시 갱신
- [x] `npm run lint:i18n-literal`(변경 파일 eslint), `npm run check:i18n-keys` 통과 확인

## 검증

- [x] `npx tsc --noEmit`: reviews 라우트 신규 오류 0건, 기존 오류 7건은 모두 무관한 테스트 파일
- [ ] 로컬 dev 서버 미기동으로 이번 세션 라이브 렌더 확인은 보류(이전 세션 SSR 확인 이력 있음)

## PR 리뷰 반영

- [x] 중첩된 `main` 요소 제거
- [x] 반응형 클래스를 `cn`으로 분리
- [x] 임시 날짜와 API 연동 TODO를 `TODO(수현)`으로 통일
- [x] 중앙 정렬 요소에 `flex-center` 적용
- [x] 색상·구분선(`border-labelsVibrant-quaternary`)·라운드·그림자를 기존 디자인 토큰과 Tailwind 유틸리티로 교체
- [x] 물건 썸네일 크기를 4px 단위로 조정하고 공통 텍스트 색상을 부모로 이동
- [x] CTA 높이 강제 덮어쓰기를 제거하고 데이터 연동 전까지 비활성화
- [x] safe area를 헤더 높이에 포함하고 직접 진입 시 홈으로 이동하는 뒤로가기 fallback 적용
- [x] 임의의 hero gap을 제거하고 flex 레이아웃으로 정렬
- [x] 이미지 포맷 및 글꼴 토큰 전역 변경을 현재 PR에서 제거

## Figma 정합 2차 (node 17250-28984, MCP)

- [x] 토큰/폰트/스크린샷 확보(get_design_context, get_variable_defs). Code Connect는 플랜 제한으로 미사용
- [x] 문구 교정: "감사의 후기가"(기존 설레는), 편지 본문·물건명 전체를 Figma 텍스트로 ko/en 동기화
- [x] 히어로 초록색 `#4ccd99`(brand/normal/default2 = #00b76e@70% over white), 칩 `bg-white/[0.33] border-[0.5px] border-white`
- [x] 히어로 메시지 2단: 성수317님 `text-h2-regular`(20) + 볼드 블록 `text-h1-bold`(24)
- [x] 닉네임 Body1/Bold → `customFonts`에 `body1-bold`(16/700) 토큰 추가 후 적용
- [x] 위치/날짜 행: 중점 제거, gap-3. 날짜 `text-body2-semibold text-labelsVibrant-secondary`(#999)
- [x] 편지 박스 `bg-layoutBrand`(#eefff6) px-4 py-5, 본문 16/lh1.88/`labelsVibrant-primary`(#333)
- [x] 라벨(이런 점/찾아준 물건) `text-body2-semibold text-labelsVibrant-secondary`
- [x] 장점 텍스트 `text-body1-medium`(#333), 체크 원 `bg-fill-brand-normal-default` + `Check` 아이콘
- [x] 카드 gap 구조(gap-8/gap-6), 라운드16, shadow2, 구분선 `#e4e4e4`, 페이지/카드 배경 흰색
- [x] 찾아준 물건: 썸네일 size-[69px] rounded-16, 이름 `text-h3-semibold`(#5d5d5d) truncate, 메타 `text-body2-regular`(#5d5d5d)
- [x] CTA: 공통 `Button variant=auth` + `!h-12`(48), 흰 테두리, shadow2, 액션영역 border-t #e4e4e4, pb-32

## 남은 placeholder / 후속

- [ ] 후기 캐릭터 일러스트(Figma node 17250:28986, 감사/편지/꽃잎 PNG) 교체 — Figma MCP Starter 플랜 호출 한도로 이번 세션 다운로드 불가. 한도 해제 후 download_assets로 받아 교체
- [ ] 편지 전용 폰트 NanumSquareRound 탑재(네이버 전용, Google Fonts 미제공 → self-host 필요). 현재 Pretendard로 대체, 메트릭만 일치
- [ ] 프로필/물건 썸네일 실제 이미지 연동

## 비고

- 브랜치가 origin/develop보다 117 커밋 뒤처져 있음. rebase 여부는 사용자 확인 후 진행(임의 수행하지 않음).
- 라우트는 로그인 가드가 걸려 있어 비인증 상태에서 `/login`으로 307 리다이렉트. 렌더 확인은 로그인된 브라우저 세션에서 가능.
