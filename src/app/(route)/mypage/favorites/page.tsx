"use client";

import { FilterSection, MypageSearch, DetailHeader } from "@/components";
import { MypageFavoritesContent } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="즐겨찾기 목록" />
      <h1 className="sr-only">즐겨찾기 목록 페이지</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="favorites" />

        <FilterSection pageType="MY_FAVORITES" />

        <MypageFavoritesContent />
      </div>
    </>
  );
};

export default page;
