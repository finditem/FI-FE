/**
 * 필터 상태 객체를 URL 쿼리 스트링으로 변환하기 위한 매핑 정보와 변환 함수들을 포함하는 유틸리티입니다.
 * 내부의 각 MAP 객체는 클라이언트 상태 값(Enum/Type)을 URL에 적합한 소문자 문자열로 매핑합니다.
 *
 * @author jikwon
 */

import { ActivityFilterValue } from "@/app/(route)/mypage/activities/_types/ActivityFilterType";
import {
  CategoryFilterValue,
  FindStatusFilterValue,
  SortFilterValue,
  StatusFilterValue,
} from "../../components/domain/FilterSectionBottomSheet/_types/types";
import {
  ActivityType,
  CategoryType,
  InquiryFilterStatus,
  ItemStatus,
  PostType,
  ReportFilterStatus,
  SimpleSortType,
} from "@/types";
import { ReportStatusFilterValue } from "@/app/(route)/mypage/reports/_types/MypageReportsFilterType";
import { InquiryStatusFilterValue } from "@/app/(route)/mypage/inquiries/_types/MypageInquiriesFilterType";

const CATEGORY_QUERY_VALUE_MAP: Record<CategoryType, string> = {
  ELECTRONICS: "electronics",
  WALLET: "wallet",
  ID_CARD: "id_card",
  JEWELRY: "jewelry",
  BAG: "bag",
  CARD: "card",
  ETC: "etc",
};

const SORT_QUERY_VALUE_MAP: Record<SortFilterValue, string> = {
  LATEST: "latest",
  OLDEST: "oldest",
  MOST_FAVORITED: "most_favorited",
  MOST_VIEWED: "most_viewed",
};

const FIND_STATUS_QUERY_VALUE_MAP: Record<ItemStatus, string> = {
  FOUND: "found",
  SEARCHING: "searching",
};

const STATUS_QUERY_VALUE_MAP: Record<PostType, string> = {
  LOST: "lost",
  FOUND: "found",
};

const ACTIVITY_QUERY_VALUE_MAP: Record<ActivityType, string> = {
  POST: "post",
  COMMENT: "comment",
  FAVORITE: "favorite",
  INQUIRY: "inquiry",
  REPORT: "report",
};

export const SIMPLE_SORT_QUERY_VALUE_MAP: Record<SimpleSortType, string> = {
  LATEST: "latest",
  OLDEST: "oldest",
};

const REPORT_STATUS_QUERY_VALUE_MAP: Record<ReportFilterStatus, string> = {
  ALL: "all",
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
};

const INQUIRY_STATUS_QUERY_VALUE_MAP: Record<InquiryFilterStatus, string> = {
  ALL: "all",
  RECEIVED: "received",
  PENDING: "pending",
  ANSWERED: "answered",
};

const categoryToQueryValue = (category: CategoryFilterValue): string | undefined => {
  if (!category) return undefined;
  return CATEGORY_QUERY_VALUE_MAP[category];
};

const sortToQueryValue = (sort: SortFilterValue): string => {
  return SORT_QUERY_VALUE_MAP[sort];
};

const findStatusToQueryValue = (findStatus: FindStatusFilterValue): string | undefined => {
  if (!findStatus) return undefined;
  return FIND_STATUS_QUERY_VALUE_MAP[findStatus];
};

const statusToQueryValue = (status: StatusFilterValue): string | undefined => {
  if (!status) return undefined;
  return STATUS_QUERY_VALUE_MAP[status];
};

const activityToQueryValue = (activity: ActivityFilterValue): string | undefined => {
  if (!activity) return undefined;
  return ACTIVITY_QUERY_VALUE_MAP[activity];
};

const simpleSortToQueryValue = (simpleSort: SimpleSortType): string => {
  return SIMPLE_SORT_QUERY_VALUE_MAP[simpleSort];
};

const reportStatusToQueryValue = (reportStatus: ReportStatusFilterValue): string | undefined => {
  if (!reportStatus) return undefined;
  return REPORT_STATUS_QUERY_VALUE_MAP[reportStatus];
};

const inquiryStatusToQueryValue = (inquiryStatus: InquiryStatusFilterValue): string | undefined => {
  if (!inquiryStatus) return undefined;
  return INQUIRY_STATUS_QUERY_VALUE_MAP[inquiryStatus];
};

const FILTER_TRANSFORMERS: Record<string, (val: any) => string | undefined> = {
  category: (val) => categoryToQueryValue(val),
  sort: (val) => (val ? sortToQueryValue(val) : undefined),
  status: (val) => statusToQueryValue(val),
  findStatus: (val) => findStatusToQueryValue(val),
  activity: (val) => activityToQueryValue(val),
  simpleSort: (val) => (val ? simpleSortToQueryValue(val) : undefined),
  reportStatus: (val) => reportStatusToQueryValue(val),
  inquiryStatus: (val) => inquiryStatusToQueryValue(val),
  region: (val) => val,
  startDate: (val) => val,
  endDate: (val) => val,
};

/**
 * 필터 상태 객체를 기반으로 URL 쿼리 스트링을 업데이트하는 유틸리티 함수입니다.
 *
 * @remarks
 * - 변환된 값이 없으면 해당 파라미터를 URL에서 제거합니다.
 * - `findStatus` 키는 URL에서 `find-status`로 변환됩니다.
 * - `FILTER_TRANSFORMERS`에 등록되지 않은 키는 변환 없이 그대로 사용됩니다.
 *
 * @returns 업데이트된 쿼리 스트링
 */

type ApplyFiltersToUrlProps<T extends object> = {
  /** 적용할 필터 상태 객체 (변경할 키만 포함하면 됨) */
  filters: Partial<T>;
  /** 현재 URL의 쿼리 파라미터 */
  searchParams: URLSearchParams;
};

/**
 * @example
 * ```ts
 * const query = applyFiltersToUrl({
 *   filters: { category: "ELECTRONICS", sort: undefined },
 *   searchParams: new URLSearchParams("sort=latest"),
 * });
 * // 결과: "category=electronics" (sort는 undefined이므로 제거됨)
 * ```
 */

export const applyFiltersToUrl = <T extends object>({
  filters,
  searchParams,
}: ApplyFiltersToUrlProps<T>): string => {
  const params = new URLSearchParams(searchParams.toString());

  (Object.keys(filters) as Array<keyof T>).forEach((key) => {
    const value = filters[key];
    const stringKey = String(key);

    const transformer = FILTER_TRANSFORMERS[stringKey];
    const transformedValue = transformer ? transformer(value) : (value as string | undefined);

    const queryKey = stringKey === "findStatus" ? "find-status" : stringKey;

    if (!transformedValue) {
      params.delete(queryKey);
    } else {
      params.set(queryKey, transformedValue);
    }
  });

  return params.toString();
};
