import { useRouter, useSearchParams } from "next/navigation";
import { ReportsTabType } from "../_types/ReportsTabType";

export const useReportsQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? undefined;

  const activeTab: ReportsTabType = searchParams.get("type") === "inquiry" ? "inquiry" : "report";

  const handleKeywordSearch = (newKeyword: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newKeyword === params.get("keyword")) return;

    if (!newKeyword) {
      params.delete("keyword");
    } else {
      params.set("keyword", newKeyword);
    }

    router.replace(`/admin/reports?${params.toString()}`);
  };

  const handleTabChange = (key: ReportsTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("type", key);
    params.delete("status");
    params.delete("answered");

    router.replace(`/admin/reports?${params.toString()}`);
  };

  return {
    searchParams,
    keyword,
    activeTab,
    handleKeywordSearch,
    handleTabChange,
  };
};
