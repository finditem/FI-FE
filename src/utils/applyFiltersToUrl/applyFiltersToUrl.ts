/**
 * @author jikwon
 *
 * 필터 상태 객체를 URL 쿼리 스트링으로 변환하기 위한 매핑 정보와 변환 함수들을 포함하는 유틸리티입니다.
 * 내부에 정의된 각 MAP 객체는 클라이언트의 상태 값(Enum/Type)을 URL에 적합한 문자열로 매핑합니다.
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

type ApplyFiltersToUrlProps<T extends object> = {
  filters: Partial<T>;
  searchParams: URLSearchParams;
};

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
