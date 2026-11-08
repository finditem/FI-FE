"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { UserProfileTabKey } from "../../_types/UserProfileTabType";

const DEFAULT_TAB: UserProfileTabKey = "posts";

const isUserProfileTabKey = (value: string | null): value is UserProfileTabKey => {
  return value === "posts" || value === "comments" || value === "favorites" || value === "reviews";
};

export const useUserProfileTabQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const tab: UserProfileTabKey = isUserProfileTabKey(rawTab) ? rawTab : DEFAULT_TAB;

  const updateTabQuery = (nextTab: UserProfileTabKey) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTab === DEFAULT_TAB) params.delete("tab");
    else params.set("tab", nextTab);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return { tab, updateTabQuery };
};
