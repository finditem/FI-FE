# Axios + TanStack Query + Next.js (CSR/SSR/SSG/ISR) 통합 가이드

> 원본: Confluence 팀 가이드. 팀원들이 Axios와 TanStack Query를 프로젝트 컨벤션과 동일한 구조로
> 사용할 수 있도록 정리한 문서입니다. 핵심 규칙 요약은 루트 `CLAUDE.md`의 "데이터 패칭" 절에 있고,
> 이 문서는 새 API 훅을 작성할 때 참고하는 상세 레퍼런스입니다.

## 1. Axios API 세팅

### 폴더 구조

```
src/api/_base/
├── axios/
│   ├── authApi.ts       // 인증(쿠키)·refresh 인터셉터
│   ├── publicApi.ts     // 공개 API
│   ├── getBaseURL.ts    // SSR/CSR 기준 URL 분기
│   └── useAxios.ts      // auth | public 인스턴스 선택
├── query/
│   ├── useAppQuery.ts
│   ├── useAppMutation.ts
│   ├── useAppInfiniteQuery.ts
│   ├── useAppCompositeInfiniteQuery.ts
│   └── useServerPrefetchQuery.ts
└── types/
    └── ...
```

도메인별 API 훅은 `src/api/fetch/{domain}/api/`에 두고, 위 베이스 훅만 조합하는 것을 권장합니다.

### getBaseURL — SSR에서 Invalid URL 방지

- 서버 (`typeof window === "undefined"`이고 `NEXT_PUBLIC_API_URL`이 있을 때): 환경 변수 기준 절대 URL 사용.
- 브라우저: `/api` — Next.js rewrite로 백엔드 프록시.

상대 경로만 쓰면 Node 런타임에서 origin이 없어 요청이 실패할 수 있으므로, 인스턴스 생성 시 반드시
`getBaseURL()`을 씁니다.

### authApi / publicApi 요약

- 공통: `baseURL: getBaseURL()`, `timeout: 5000`.
- `authApi`: `withCredentials: true`, 401 시 refresh 재시도, 실패 시 보호 경로면 로그인으로 이동 등 클라이언트 전용 응답 인터셉터.
- `publicApi`: 공개 엔드포인트용.

구현은 각각 `src/api/_base/axios/authApi.ts`, `publicApi.ts`를 참고합니다.

### useAxios

클라이언트 전용 훅입니다. 일반적으로는 `useAppQuery` / `useAppMutation` / `useAppInfiniteQuery`가
내부에서 사용합니다. 인터셉터가 필요한 특수 호출 등에서만 직접 import 합니다.

```ts
// src/api/_base/axios/useAxios.ts
"use client";
import authApi from "./authApi";
import publicApi from "./publicApi";
type ApiType = "auth" | "public";
const useAxios = (apiType: ApiType) => {
  switch (apiType) {
    case "auth":
      return authApi;
    case "public":
      return publicApi;
    default:
      return publicApi;
  }
};
export default useAxios;
```

## 2. CSR 전용 Query 훅

### useAppQuery

경로: `@/api/_base/query/useAppQuery`

`UseQueryOptions`에서 `queryKey`·`queryFn`을 제외한 옵션에, `suspense`를 명시적으로 포함하는 확장 타입을 사용합니다.

- 제네릭
  - `TQueryFnData`: Axios GET 응답 본문 타입
  - `TError`: 실패 시 에러 타입 (기본 `unknown`)
  - `TData`: `select` 등으로 가공 후 실제로 쓰는 데이터 타입 (기본 `TQueryFnData`)
- 파라미터
  - `apiType`: `"auth"`(인증) | `"public"`(공개)
  - `queryKey`: 예) `["posts"]`, `["post", id]`
  - `url`: API 경로 (예: `/posts/1`)
  - `options`: `staleTime`, `select`, `enabled`, `suspense` 등 (`queryKey` / `queryFn` 제외)
- 기본값 (훅 내부): `retry: 1`, `refetchOnWindowFocus: false`, `staleTime: 1000 * 60` — `options`로 덮어쓸 수 있습니다.

### useAppMutation

경로: `@/api/_base/query/useAppMutation`

```ts
useAppMutation<TVariables, TData, TError, TContext>(
  apiType: "auth" | "public",
  url: string | ((variables: TVariables) => string),
  method: "post" | "put" | "patch" | "delete",
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  appMutationConfig?: { sendDeleteBody?: boolean }
);
```

- 제네릭
  - `TVariables`: `mutate` 인자 타입
  - `TData`: 서버 응답 본문 타입 (기본 `unknown`)
  - `TError`, `TContext`: 표준 TanStack Mutation과 동일
- DELETE와 `sendDeleteBody`
  - 기본: DELETE 요청에 body/params를 싣지 않음. `variables`는 동적 URL 생성·캐시 무효화 등에만 사용.
  - `sendDeleteBody: true`: `variables`를 JSON body(`config.data`)로 전송.
- 기본값: `retry: 0`

### useAppInfiniteQuery

경로: `@/api/_base/query/useAppInfiniteQuery`

Cursor 기반 GET 무한 스크롤용입니다. `axios.get`으로 페이지를 가져옵니다.

- 주요 옵션
  - `pageParamName` (기본 `"cursor"`): 쿼리스트링 이름. `pageParam`이 있으면 `?cursor=...` 형태로 붙음.
  - `initialPageParam`, `getNextPageParam`: 미지정 시, 응답이 `ApiBaseResponseType<{ nextCursor: string | null }>` 형태면 `result.nextCursor`로 다음 페이지 파라미터를 추론.
  - `suspense` 등 나머지는 `useAppQuery`와 유사한 패턴.
- 제네릭: 페이지 단위 응답 `TQueryFnData`, `TError`, 가공 후 `TData` (기본 `TQueryFnData`).

공통 응답 래퍼 타입은 `ApiBaseResponseType<T>` (`src/api/_base/types/ApiBaseResponseType.ts`)입니다.

### useAppCompositeInfiniteQuery

경로: `@/api/_base/query/useAppCompositeInfiniteQuery`

Axios를 사용하지 않습니다. `queryFn`·`initialPageParam`·`getNextPageParam`을 도메인 훅에서 전부 정의합니다.

- 한 개의 `pageParam` 이름으로 URL을 만들기 어려운 경우 (예: `lastDistance` + `lastPostId`).
- URL·쿼리스트링을 호출부에서 완전히 제어해야 할 때.
- 역할: `retry: 1`, `staleTime: 1000 * 60`, `refetchOnWindowFocus: false` 등 전역 정책 정렬만 담당합니다.
- 실사용 예: `useSearchLocation`, `useMapPostSummary` 등.

## 3. 서버 전용 Prefetch (SSR / SSG / ISR)

경로: `@/api/_base/query/useServerPrefetchQuery`

파일 상단 `"server-only"` — 클라이언트 번들에 섞이지 않게 합니다.

```ts
// 개념적 사용 형태
await useServerPrefetchQuery({
  queryClient,
  queryKey: ["users-me"],
  fetcher: () => fetch(/* 절대 URL + 필요 시 Cookie 헤더 */, { next: { revalidate: ... } }).then(...),
});
```

### 팀 규칙

- ISR을 쓰려면 `fetcher`는 반드시 네이티브 `fetch` 기반이어야 하며, `next: { revalidate: 초 }` (또는 프로젝트 정책에 맞는 `cache` 옵션)를 명시합니다.
- 인증이 필요한 프리패치는 서버에서 `cookies()`로 얻은 값을 Cookie 헤더 등으로 넘기는 패턴을 사용합니다.
- 훅 내부 기본값: `staleTime: 1000 * 60`, `gcTime: 1000 * 60 * 5` (TanStack Query v5 용어; 과거 `cacheTime`과 동일 개념).
- 프로젝트 예시: `src/app/(route)/mypage/layout.tsx` (`["users-me"]` 프리패치, `revalidate: 0` 등).

## 4. 전역 QueryClient Provider

파일: `src/providers/QueryProviders.tsx`
루트 레이아웃에서는 default export 이름이 `Providers`입니다.

```tsx
import Providers from "@/providers/QueryProviders";
// <Providers>{children}</Providers>
```

- SSR 시점: 요청마다 새 `QueryClient` (또는 해당 레이아웃에서 명시적으로 생성한 인스턴스).
- 브라우저: 탭 단위 싱글턴 재사용.
- 기본 queries: `staleTime` 1분, `gcTime` 10분, `retry: 1`, `refetchOnWindowFocus: false`.
- `NODE_ENV === "development"`일 때만 `ReactQueryDevtools` (`initialIsOpen={false}`).

## 5. SSR / SSG / ISR 적용 방법

### 1) 서버에서 Prefetch

```tsx
import useServerPrefetchQuery from "@/api/_base/query/useServerPrefetchQuery";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ExampleLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  await useServerPrefetchQuery({
    queryClient,
    queryKey: ["posts"],
    fetcher: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        next: { revalidate: 60 }, // ISR: 60초
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      }),
  });
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
```

- SSR: 요청마다 fetch 실행 (정책에 따라 `cache: "no-store"` 또는 `revalidate: 0` 등).
- SSG / 정적 캐시: 라우트·fetch 옵션 조합은 Next.js App Router 정책에 따름.
- ISR: `next: { revalidate: number }`로 재검증 주기 지정.
- 인증 API는 절대 URL + Cookie 헤더를 맞추는 것이 일반적입니다.

### 2) 클라이언트에서 동일 queryKey 사용

```tsx
"use client";
import useAppQuery from "@/api/_base/query/useAppQuery";

export default function PostList() {
  const { data } = useAppQuery<Post[]>("public", ["posts"], "/posts");
  // ...
}
```

서버에서 prefetch한 queryKey와 클라이언트 `useAppQuery`의 queryKey를 동일하게 맞추면, Hydration 후
즉시 캐시를 재사용합니다.

## 6. 전체 동작 흐름

1. 서버 (Layout / Page): `QueryClient` 생성 → `useServerPrefetchQuery`로 fetch 기반 패칭 → `dehydrate` → `HydrationBoundary`로 직렬화 상태 전달.
2. HTML: 프리패치된 데이터가 포함된 응답 생성 (라우트 렌더 모드에 따라 SSR / SSG / ISR).
3. 클라이언트: `useAppQuery` / `useInfiniteQuery` 계열 훅이 같은 queryKey로 쿼리 데이터 관리 → 필요 시 `invalidateQueries` 등으로 갱신.

## 7. 팀 규칙 (핵심 요약)

- 조회·변경의 기본 경로
  - 단건/목록 조회: `useAppQuery`
  - 생성·수정·삭제: `useAppMutation` (method·동적 url·`sendDeleteBody` 규칙 준수)
  - 단순 cursor 무한 스크롤: `useAppInfiniteQuery`
  - 복합 pageParam·URL 제어: `useAppCompositeInfiniteQuery`
- 서버 프리패치: `useServerPrefetchQuery` + 네이티브 fetch + (필요 시) `next.revalidate` / 쿠키.
- 서버·클라이언트 캐시 연결: Query Key 일치 필수.
- 도메인 훅 위치: `src/api/fetch/{domain}/api`에 두고 베이스 훅만 사용하는 패턴 유지.
- 예외: 인터셉터·WebSocket 등으로 Axios 인스턴스가 직접 필요하면 `useAxios` 또는 `authApi` / `publicApi`를 해당 모듈 한정으로 사용하고, 리뷰 시 근거를 남깁니다.

## 8. 관련 파일 빠른 참조

| 목적          | 경로                                |
| ------------- | ----------------------------------- |
| Auth Axios    | `src/api/_base/axios/authApi.ts`    |
| Public Axios  | `src/api/_base/axios/publicApi.ts`  |
| Base URL      | `src/api/_base/axios/getBaseURL.ts` |
| Axios 선택 훅 | `src/api/_base/axios/useAxios.ts`   |
| Query 래퍼들  | `src/api/_base/query/*.ts`          |
| 전역 Provider | `src/providers/QueryProviders.tsx`  |
| 프리패치 예시 | `src/app/(route)/mypage/layout.tsx` |
