"use client";

/**
 * 
 * @author jikwon (Original)
 * @author suhyeon (Refactored)
 * 
 * URL의 query parameter를 읽어 필터 상태 객체로 변환하는 훅입니다.
 *
 * Next.js App Router의 `useSearchParams`를 이용하여 현재 URL의
 * 검색 파라미터를 가져온 뒤, 문자열 값을 애플리케이션에서 사용하는
 * Enum 타입으로 정규화하여 반환한다.
 *
 * 주요 목적
 * - URL 기반 필터 상태 관리
 * - 필터 UI 초기값 제공
 * - API 요청 파라미터 생성
 * - 잘못된 query 값을 enum 기준으로 검증
 *
 * 동작 방식
 * 1. `useSearchParams()`로 URL query 읽기
 * 2. `searchParams.get()`으로 문자열 값 추출
 * 3. `normalizeEnumValue`로 Enum 타입 검증 및 변환
 * 4. 필터 객체 형태로 반환
 *
 * 반환 값
 * @returns {{
 *  type: string | undefined
 *  status: StatusFilterValue | undefined
 *  category: CategoryFilterValue | undefined
 *  sort: SortFilterValue | undefined
 *  region: string | null
 *  findStatus: FindStatusFilterValue | undefined
 *  date: string | null
 *  activity: ActivityFilterValue | null
 *  simpleSort : SimpleSortFilterValue | undefined
 * requestStatus: RequestStatusFilterValue | undefined
 * }}
 *
 * @example
 * 
 * ```ts
  const { region, category, sort, status, findStatus, date, activity } = useFilterParams();
 * ```
 */

import { useSearchParams } from "next/navigation";
import { normalizeEnumValue } from "@/utils";
import {
  CategoryFilterValue,
  FindStatusFilterValue,
  SortFilterValue,
  StatusFilterValue,
} from "../../../components/domain/FilterSectionBottomSheet/_types/types";
import { ActivityFilterValue } from "@/app/(route)/mypage/activities/_types/ActivityFilterType";
import { SimpleSortType } from "@/types";
import { ReportStatusFilterValue } from "@/app/(route)/mypage/reports/_types/MypageReportsFilterType";
import { InquiryStatusFilterValue } from "@/app/(route)/mypage/inquiries/_types/MypageInquiriesFilterType";

export const useFilterParams = () => {
  const searchParams = useSearchParams();

  return {
    type: normalizeEnumValue(searchParams.get("type")),
    status: normalizeEnumValue<Exclude<StatusFilterValue, undefined>>(searchParams.get("status")),
    category: normalizeEnumValue<Exclude<CategoryFilterValue, undefined>>(
      searchParams.get("category")
    ),
    sort: normalizeEnumValue<SortFilterValue>(searchParams.get("sort")),
    region: searchParams.get("region"),
    findStatus: normalizeEnumValue<Exclude<FindStatusFilterValue, undefined>>(
      searchParams.get("find-status")
    ),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    activity: normalizeEnumValue<Exclude<ActivityFilterValue, undefined>>(
      searchParams.get("activity")
    ),
    simpleSort: normalizeEnumValue<SimpleSortType>(searchParams.get("simpleSort")),
    reportStatus: normalizeEnumValue<Exclude<ReportStatusFilterValue, undefined>>(
      searchParams.get("reportStatus")
    ),
    inquiryStatus: normalizeEnumValue<Exclude<InquiryStatusFilterValue, undefined>>(
      searchParams.get("inquiryStatus")
    ),
  };
};
