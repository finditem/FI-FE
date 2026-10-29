"use client";

import useAxios from "../axios/useAxios";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from "@tanstack/react-query";
import { shouldRetryQuery } from "./_internal/shouldRetryQuery/shouldRetryQuery";

// 제네릭
// TQueryData: axios 요청 후 서버에서 받아올 데이터 타입
// TError: 쿼리 요청 실패 시 에러 타입, 기본 unknown
// TData: useQuery훅이 실제 반환하는 데이터 타입, 기본 값은 TQueryData와 동일

// 파라미터
// apiType: 'auth' -> 토큰이 필요한 요청, 'public' -> 공개 API
// queryKey: tanstack query query key (ex: ["posts"], ["post", id])
// url: api 요청 엔드포인트
// option: 추가 useQuery option (ex: {staleTime: 1000 * 30, suspense: true} (객체로 삽입))
// suspense: true 시 Suspense boundary에서 로딩 상태 감지 가능

// UseQueryOptions는 suspense를 omit하므로, suspense 옵션을 포함한 확장 타입 사용
type UseAppQueryOptions<TQueryFnData, TError, TData> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData>,
  "queryKey" | "queryFn"
> & {
  suspense?: boolean;
};

const useAppQuery = <TQueryFnData, TError = unknown, TData = TQueryFnData>(
  apiType: "auth" | "public",
  queryKey: QueryKey,
  url: string,
  options?: UseAppQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> => {
  const axios = useAxios(apiType);

  return useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const { data } = await axios.get<TQueryFnData>(url, { signal });
      return data;
    },
    retry: shouldRetryQuery,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    ...options,
  } as UseQueryOptions<TQueryFnData, TError, TData>);
};

export default useAppQuery;
