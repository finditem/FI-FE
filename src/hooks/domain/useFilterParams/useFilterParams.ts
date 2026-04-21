"use client";

/**
 * URL 쿼리 파라미터를 읽어 필터 상태 객체로 변환하는 커스텀 훅입니다.
 *
 * @remarks
 * - `useSearchParams`로 URL 쿼리를 읽고 `normalizeEnumValue`로 Enum 타입으로 정규화합니다.
 * - 잘못된 쿼리 값은 undefined로 반환됩니다.
 * - 필터 UI 초기값 설정 및 API 요청 파라미터 생성에 사용됩니다.
 *
 * @returns URL 쿼리 기반 필터 상태 객체
 * - `type`: 게시글 타입
 * - `status`: 게시글 상태 필터
 * - `category`: 카테고리 필터
 * - `sort`: 정렬 필터
 * - `region`: 지역 필터
 * - `findStatus`: 아이템 찾음 상태 필터
 * - `startDate`: 시작일 필터
 * - `endDate`: 종료일 필터
 * - `activity`: 활동 내역 타입 필터
 * - `simpleSort`: 최근, 오래된 순 필터
 * - `reportStatus`: 신고 상태 필터
 * - `inquiryStatus`: 문의 상태 필터
 *
 * @author jikwon
 * @author suhyeon
 */

/**
 * @example
 * ```ts
 * const { region, category, sort, status, findStatus } = useFilterParams();
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
