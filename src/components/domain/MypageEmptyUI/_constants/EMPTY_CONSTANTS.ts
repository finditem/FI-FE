import { IconName } from "@/components/common/Icon/Icon";

export const EMPTY_ICON_MAP: Record<
  "posts" | "comments" | "favorites" | "reports" | "inquiries" | "activity",
  IconName
> = {
  posts: "NoPosts",
  comments: "NoComments",
  favorites: "EmptyFavorite",
  reports: "NoReports",
  inquiries: "NoInquiries",
  activity: "NoActivity",
};
