"use client";

import { DetailHeader, FilterSection, MypageSearch } from "@/components";
import { MypagePostsContent } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="내가 쓴 게시글" />
      <h1 className="sr-only">내가 쓴 게시글 페이지</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="posts" />

        <FilterSection pageType="MY_POSTS" />

        <MypagePostsContent />
      </div>
    </>
  );
};

export default page;
