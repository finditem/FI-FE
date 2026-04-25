# 찾아줘!

<p align="center">
  <a href="https://www.finditem.kr/">
    <img src="https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png" width="100%" alt="Find My Item Banner" style="border-radius: 12px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);" />
  </a>
</p>

<div align="center">
  <h3><b>우리 동네 분실물 찾기 | 찾아줘!</b></h3>

  <img src="https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" />
  <img src="https://img.shields.io/badge/Sentry-362D59?style=flat-square&logo=sentry&logoColor=white" />
</div>

---

## 프로젝트 소개

<strong>찾아줘!</strong>는 지도 기반으로 분실물과 습득물을 쉽게 찾고 공유할 수 있는 커뮤니티 서비스입니다.
경찰청 데이터와 연동하여 정보를 제공하며, 실시간 채팅과 알림 기능을 통해 잃어버린 물건을 빠르게 찾을 수 있도록 돕습니다.

## 핵심 기능

| 분류               | 설명                                                         |
| :----------------- | :----------------------------------------------------------- |
| **지도 기반 확인** | 지도를 통해 내 주변의 분실/습득물을 직관적으로 확인          |
| **실시간 채팅**    | STOMP를 활용하여 사용자 간 실시간 대화 지원                  |
| **실시간 알림**    | SSE를 활용한 실시간 알림 (채팅, 댓글, 관심 카테고리 알림 등) |
| **상세 검색**      | 카테고리, 날짜, 장소 등 다양한 필터 조건으로 상세 검색       |
| **공공 데이터**    | 경찰청 Lost112 데이터를 연동하여 폭넓은 분실물 정보 제공     |
| **모바일 최적화**  | PWA를 적용하여 네이티브 앱과 유사한 모바일 경험 제공         |

## 기술 스택

### **Frontend**

- **Framework:** `Next.js 15 (App Router)`
- **Language:** `TypeScript 5`
- **Styling:** `Tailwind CSS 4`, `Framer Motion`

### **State & Data**

- **State Management:** `Zustand`
- **Data Fetching:** `TanStack Query v5`
- **API Client:** `Axios`
- **Real-time:** `STOMP`, `SockJS`

### **Testing**

- **Unit/Integration:** `Jest`, `React Testing Library`
- **E2E:** `Playwright`
- **Visual:** `Storybook 9`, `Chromatic`
- **Mocking:** `MSW`

### **Observability & DevOps**

- **Monitoring:** `Sentry`
- **Analytics:** `Vercel Analytics`, `Speed Insights`, `Microsoft Clarity`
- **Security:** `Snyk`
- **CI/CD:** `GitHub Actions`, `Vercel`

## 개발 컨벤션

- **Code Style:** `Prettier`
- **Git Hooks:** `Husky` + `Lint-staged`
- **Commits:** `Conventional Commits`

## 브랜치 전략 (Branching Strategy)

**Git-flow**를 기본 워크플로우로 채택하여, 빠르고 안전한 배포가 가능하도록 팀 환경에 맞춘 전략을 운용합니다

### 브랜치 워크플로우 시각화

<p align="center">
  <img src="https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/fceb3f13-6_%E1%84%87%E1%85%B3%E1%84%85%E1%85%A2%E1%86%AB%E1%84%8E%E1%85%B5%20%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%85%E1%85%A3%E1%86%A8.png" width="100%" alt="프론트엔드_브랜치_워크플로우_시각화" />
</p>

### 브랜치 운영 원칙

| 브랜치명      | 설명                                               | 비고                         |
| :------------ | :------------------------------------------------- | :--------------------------- |
| **`main`**    | **Production**: 실제 서비스가 운영되는 브랜치      | 가장 안정적인 상태 유지      |
| **`release`** | **Staging**: 배포 전 최종 검수(QA)를 위한 브랜치   | Vercel 고정 도메인 연결      |
| **`develop`** | **Development**: 다음 버전을 위한 개발 중심 브랜치 | 모든 기능(Feature)의 통합    |
| **`hotfix`**  | **Hotfix**: 운영 환경(`main`)의 긴급 버그 수정     | 필요 시 생성 후 완료 시 삭제 |

## 프로젝트 구조

```text
src/
├── app/            # App Router 페이지 및 레이아웃
├── components/     # 공통 UI 컴포넌트
├── api/            # API 요청 함수 및 Axios 인스턴스
├── store/          # Zustand 스토어
├── hooks/          # 커스텀 훅
├── constants/      # 공통 상수
├── providers/      # QueryClient, Context 등 전역 프로바이더
├── context/        # 전역 상태 (React Context)
├── types/          # 공통 타입 정의
├── utils/          # 유틸리티 함수
└── assets/         # 폰트, 이미지 등 정적 리소스
```

## 프론트엔드 팀원 및 역할

- **[서지권](https://github.com/wlrnjs) (Lead)**
  - RSC 기반 프론트엔드 아키텍처 설계
  - 공통 지도 컴포넌트 및 주소 변환 로직 구현
  - 게시글 댓글 시스템 개발
  - 디자인 시스템, CI/CD, 모니터링 환경 세팅
- **[권형준](https://github.com/DevHyungJun)**
  - STOMP/SSE를 이용한 실시간 채팅 및 알림 기능 구현
  - 카카오맵 API 연동 및 마커 처리
- **[이수현](https://github.com/suhyeon0111)**
  - 맞춤형 검색 및 필터 UI 구현
  - 고객센터(문의하기) 기능 개발
  - 마이페이지 사용자 활동 기록 관리 기능 구현

## 시작하기

```bash
# 저장소 클론
git clone https://github.com/finditem/FI-FE.git
cd FI-FE

# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env.local # 환경 변수 파일 생성 및 수정

# 개발 서버 실행
npm run dev
```
