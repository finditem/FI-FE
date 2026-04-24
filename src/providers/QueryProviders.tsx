"use client";

import { PropsWithChildren } from "react";
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/** 앱 전역 기본값으로 `QueryClient` 인스턴스를 만듭니다. */
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

/** SSR에서는 매번 새 클라이언트, 브라우저에서는 싱글턴을 반환합니다. */
const getQueryClient = () => {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

/**
 * TanStack Query(`QueryClientProvider`)를 앱 트리에 심는 프로바이더입니다.
 *
 * @remarks
 * - `getQueryClient`로 클라이언트를 얻으며, 브라우저 탭 생명주기 동안 동일 인스턴스를 재사용합니다.
 * - `queries` 기본값으로 `staleTime`, `gcTime`, `retry`, `refetchOnWindowFocus`를 통일합니다.
 * - `NODE_ENV === "development"`일 때만 `ReactQueryDevtools`를 렌더합니다.
 *
 * @author hyungjun
 *
 * @example
 * ```tsx
 * import QueryProviders from "@/providers/QueryProviders";
 *
 * <QueryProviders>{children}</QueryProviders>
 * ```
 */

const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default Providers;
