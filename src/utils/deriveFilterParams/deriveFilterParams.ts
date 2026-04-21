import { normalizeEnumValue } from "@/utils";
import {
  CategoryFilterValue,
  FindStatusFilterValue,
  SortFilterValue,
  StatusFilterValue,
} from "../../components/domain/FilterSectionBottomSheet/_types/types";
import { ActivityFilterValue } from "@/app/(route)/mypage/activities/_types/ActivityFilterType";
import { SimpleSortType } from "@/types";
import { ReportStatusFilterValue } from "@/app/(route)/mypage/reports/_types/MypageReportsFilterType";
import { InquiryStatusFilterValue } from "@/app/(route)/mypage/inquiries/_types/MypageInquiriesFilterType";

/**
 * URL 쿼리 파라미터를 앱 내 규격화된 타입으로 변환하거나
 * 각 필터의 활성화 여부를 판별하는 유틸리티 모음입니다.
 *
 * @author jikwon
 */

type Params = {
  /** 지역 쿼리 파라미터 */
  region?: string | null;
  /** 카테고리 쿼리 파라미터 */
  category?: string | null;
  /** 정렬 쿼리 파라미터 */
  sort?: string | null;
  /** 게시글 타입(분실/습득) 쿼리 파라미터 */
  status?: string | null;
  /** 아이템 찾기 상태 쿼리 파라미터 */
  findStatus?: string | null;
  /** 시작일 쿼리 파라미터 */
  startDate?: string | null;
  /** 종료일 쿼리 파라미터 */
  endDate?: string | null;
  /** 활동 내역 타입 쿼리 파라미터 */
  activity?: string | null;
  /** 간단 정렬 쿼리 파라미터 */
  simpleSort?: string | null;
  /** 신고 상태 쿼리 파라미터 */
  reportStatus?: string | null;
  /** 문의 상태 쿼리 파라미터 */
  inquiryStatus?: string | null;
};

/**
 * URL 쿼리 파라미터 문자열을 앱 내 필터 Enum 타입으로 정규화합니다.
 *
 * @returns 정규화된 필터 Enum 값 객체
 */

export const normalizedFilterValues = ({
  category,
  sort,
  status,
  findStatus,
  activity,
  simpleSort,
  reportStatus,
  inquiryStatus,
}: Params) => {
  const normalizedCategory = normalizeEnumValue<Exclude<CategoryFilterValue, undefined>>(category);
  const normalizedSort = normalizeEnumValue<SortFilterValue>(sort);
  const normalizedStatus = normalizeEnumValue<Exclude<StatusFilterValue, undefined>>(status);
  const normalizedFindStatus =
    normalizeEnumValue<Exclude<FindStatusFilterValue, undefined>>(findStatus);
  const normalizedActivity = normalizeEnumValue<Exclude<ActivityFilterValue, undefined>>(activity);
  const normalizedSimpleSort = normalizeEnumValue<SimpleSortType>(simpleSort);
  const normalizedReportStatus =
    normalizeEnumValue<Exclude<ReportStatusFilterValue, undefined>>(reportStatus);
  const normalizedInquiryStatus =
    normalizeEnumValue<Exclude<InquiryStatusFilterValue, undefined>>(inquiryStatus);

  return {
    normalizedCategory,
    normalizedSort,
    normalizedStatus,
    normalizedFindStatus,
    normalizedActivity,
    normalizedSimpleSort,
    normalizedReportStatus,
    normalizedInquiryStatus,
  };
};

/**
 * URL 쿼리 파라미터를 기반으로 각 필터의 활성화 여부를 반환합니다.
 *
 * @returns 각 필터의 선택 여부를 나타내는 boolean 객체
 */

export const filterSelectionState = ({
  region,
  category,
  sort,
  status,
  findStatus,
  startDate,
  endDate,
  activity,
  simpleSort,
  reportStatus,
  inquiryStatus,
}: Params) => {
  const isRegionSelected = Boolean(region);
  const isCategorySelected = Boolean(category);
  const isSortSelected = Boolean(sort);
  const isStatusSelected = Boolean(status);
  const isFindStatusSelected = Boolean(findStatus);
  const isDateSelected = Boolean(startDate || endDate);
  const isActivitySelected = Boolean(activity);
  const isSimpleSortSelected = Boolean(simpleSort);
  const isReportStatusSelected = Boolean(reportStatus);
  const isInquiryStatusSelected = Boolean(inquiryStatus);

  return {
    isRegionSelected,
    isCategorySelected,
    isSortSelected,
    isStatusSelected,
    isFindStatusSelected,
    isDateSelected,
    isActivitySelected,
    isSimpleSortSelected,
    isReportStatusSelected,
    isInquiryStatusSelected,
  };
};
