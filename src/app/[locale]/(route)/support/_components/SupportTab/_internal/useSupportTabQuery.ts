"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SupportTabKey, SUPPORT_TAB_KEYS } from "./SUPPORT_TABS";

const DEFAULT_TAB: SupportTabKey = "all";

const isSupportTabKey = (value: string | null): value is SupportTabKey => {
  return value !== null && (SUPPORT_TAB_KEYS as readonly string[]).includes(value);
};

export const useSupportTabQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const tab: SupportTabKey = isSupportTabKey(rawTab) ? rawTab : DEFAULT_TAB;

  const updateTabQuery = (nextTab: SupportTabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { tab, updateTabQuery };
};
