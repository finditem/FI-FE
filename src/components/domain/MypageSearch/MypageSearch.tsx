"use client";

import { useTranslations } from "next-intl";
import { InputSearch } from "@/components/common";
import { useRouter, useSearchParams } from "next/navigation";

interface MypageSearchProps {
  searchMode: "posts" | "favorites" | "comments" | "activities" | "reports" | "inquiries";
}

const MypageSearch = ({ searchMode }: MypageSearchProps) => {
  const t = useTranslations("MypageSearch");
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentKeyword = searchParams.get("keyword") ?? "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const searchValue = value.trim();

    if (searchValue) {
      params.set("keyword", searchValue);
    } else {
      params.delete("keyword");
    }

    router.push(`/mypage/${searchMode}?${params.toString()}`);
  };

  return (
    <section className="w-full px-5 py-[10px]">
      <h2 className="sr-only">{t("sectionHeading")}</h2>
      <InputSearch
        name="search"
        defaultValue={currentKeyword}
        placeholder={t("placeholder")}
        mode="onChange"
        onEnter={(value) => handleSearch(value)}
      />
    </section>
  );
};

export default MypageSearch;
