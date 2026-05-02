/**
 *  필터 및 탭 시스템에서 사용되는 공통 타입 정의입니다.
 *
 * @author suhyeon
 */

import { CategoryType, ItemStatus, PostType } from "@/types";

// 탭 타입
export type tabsType = "LIST" | "MY_POSTS" | "MY_FAVORITES" | "PUBLIC_DATA";

// 필터 타입
export type FilterTab = "date" | "region" | "category" | "sort" | "status" | "findStatus";

export type CategoryFilterValue = CategoryType | undefined;

export type SortFilterValue = "LATEST" | "OLDEST" | "MOST_FAVORITED" | "MOST_VIEWED";

export type StatusFilterValue = PostType | undefined;

export type FindStatusFilterValue = ItemStatus | undefined;
