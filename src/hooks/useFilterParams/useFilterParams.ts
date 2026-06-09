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
import { z } from "zod";
import {
  CategoryFilterValue,
  FindStatusFilterValue,
  SortFilterValue,
  StatusFilterValue,
} from "@/components/domain/FilterSectionBottomSheet/_types/types";
import { ActivityFilterValue } from "@/app/(route)/mypage/activities/_types/ActivityFilterType";
import { SimpleSortType } from "@/types";
import { ReportStatusFilterValue } from "@/app/(route)/mypage/reports/_types/MypageReportsFilterType";
import { InquiryStatusFilterValue } from "@/app/(route)/mypage/inquiries/_types/MypageInquiriesFilterType";

const optionalEnumParam = <T extends [string, ...string[]]>(values: T, value: string | null) => {
  if (!value) return undefined;
  return z.enum(values).safeParse(value.toUpperCase()).data;
};

export const useFilterParams = () => {
  const searchParams = useSearchParams();

  return {
    type: optionalEnumParam(["LOST", "FOUND"], searchParams.get("type")),
    status: optionalEnumParam(["LOST", "FOUND"], searchParams.get("status")) as Exclude<
      StatusFilterValue,
      undefined
    >,
    category: optionalEnumParam(
      ["ELECTRONICS", "WALLET", "ID_CARD", "JEWELRY", "BAG", "CARD", "ETC"],
      searchParams.get("category")
    ) as Exclude<CategoryFilterValue, undefined>,
    sort: optionalEnumParam(
      ["LATEST", "OLDEST", "MOST_FAVORITED", "MOST_VIEWED"],
      searchParams.get("sort")
    ) as SortFilterValue,
    region: searchParams.get("region"),
    findStatus: optionalEnumParam(
      ["SEARCHING", "FOUND"],
      searchParams.get("find-status")
    ) as Exclude<FindStatusFilterValue, undefined>,
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    activity: optionalEnumParam(
      ["POST", "COMMENT", "FAVORITE", "INQUIRY", "REPORT"],
      searchParams.get("activity")
    ) as Exclude<ActivityFilterValue, undefined>,
    simpleSort: optionalEnumParam(
      ["LATEST", "OLDEST"],
      searchParams.get("simpleSort")
    ) as SimpleSortType,
    reportStatus: optionalEnumParam(
      ["ALL", "PENDING", "REVIEWED", "RESOLVED"],
      searchParams.get("reportStatus")
    ) as Exclude<ReportStatusFilterValue, undefined>,
    inquiryStatus: optionalEnumParam(
      ["ALL", "RECEIVED", "PENDING", "ANSWERED"],
      searchParams.get("inquiryStatus")
    ) as Exclude<InquiryStatusFilterValue, undefined>,
  };
};
