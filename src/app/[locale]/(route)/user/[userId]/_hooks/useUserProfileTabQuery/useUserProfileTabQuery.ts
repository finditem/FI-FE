"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { UserTabType } from "@/api/fetch/user";

const DEFAULT_TAB: UserTabType = "posts";

const isUserTabType = (value: string | null): value is UserTabType => {
  return value === "posts" || value === "comments" || value === "favorites";
};

export const useUserProfileTabQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const tab: UserTabType = isUserTabType(rawTab) ? rawTab : DEFAULT_TAB;

  const updateTabQuery = (nextTab: UserTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTab === DEFAULT_TAB) params.delete("tab");
    else params.set("tab", nextTab);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return { tab, updateTabQuery };
};
