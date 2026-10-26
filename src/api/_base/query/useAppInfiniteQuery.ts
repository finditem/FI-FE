"use client";

import useAxios from "../axios/useAxios";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import { ApiBaseResponseType } from "../types/ApiBaseResponseType";
import axiosClient from "axios";

// 제네릭
// TQueryData: axios 요청 후 서버에서 받아올 데이터 타입 (페이지 단위)
// TError: 쿼리 요청 실패 시 에러 타입, 기본 unknown
// TData: useInfiniteQuery훅이 실제 반환하는 데이터 타입, 기본 값은 TQueryData와 동일

// 파라미터
// apiType: 'auth' -> 토큰이 필요한 요청, 'public' -> 공개 API
// queryKey: tanstack query query key (ex: ["chats"], ["chats", type])
// url: api 요청 엔드포인트 (쿼리 파라미터 제외한 base url)
// options: 추가 useInfiniteQuery option
// suspense: true 시 Suspense boundary에서 로딩 상태 감지 가능

// nextCursor를 가진 타입을 위한 헬퍼 타입
type WithNextCursor = { nextCursor: string | null };

// UseInfiniteQueryOptions는 suspense를 omit하므로, suspense 옵션을 포함한 확장 타입 사용
type UseAppInfiniteQueryOptions<TQueryFnData, TError, TData> = Omit<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData, QueryKey, unknown>,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
> & {
  getNextPageParam?: (lastPage: TQueryFnData) => unknown;
  initialPageParam?: unknown;
  suspense?: boolean;
  pageParamName?: string;
};

const useAppInfiniteQuery = <TQueryFnData, TError = unknown, TData = TQueryFnData>(
  apiType: "auth" | "public",
  queryKey: QueryKey,
  url: string,
  options?: UseAppInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseInfiniteQueryResult<TData, TError> => {
  const axios = useAxios(apiType);

  // getNextPageParam이 제공되지 않았고, ApiBaseResponseType<WithNextCursor> 구조인 경우 기본값 사용
  const defaultGetNextPageParam = (lastPage: TQueryFnData): unknown => {
    const page = lastPage as unknown as ApiBaseResponseType<WithNextCursor>;
    if (page?.result && "nextCursor" in page.result) {
      return page.result.nextCursor ?? undefined;
    }
    return undefined;
  };

  const getNextPageParam = options?.getNextPageParam ?? defaultGetNextPageParam;
  const initialPageParam = options?.initialPageParam ?? undefined;
  const pageParamName = options?.pageParamName ?? "cursor";

  const { getNextPageParam: _, initialPageParam: __, pageParamName: ___, ...rest } = options ?? {};

  return useInfiniteQuery<TQueryFnData, TError, TData, QueryKey, unknown>({
    queryKey,
    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams();

      if (pageParam !== undefined && pageParam !== null) {
        params.append(pageParamName, String(pageParam));
      }

      const separator = url.includes("?") ? "&" : "?";
      const fullUrl = params.toString() ? `${url}${separator}${params.toString()}` : url;

      const { data } = await axios.get<TQueryFnData>(fullUrl, { signal });
      return data;
    },
    initialPageParam,
    getNextPageParam,
    retry: (count, error) =>
      !axiosClient.isCancel(error) &&
      !(axiosClient.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) &&
      count < 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    ...rest,
  } as UseInfiniteQueryOptions<TQueryFnData, TError, TData, QueryKey, unknown>);
};

export default useAppInfiniteQuery;
