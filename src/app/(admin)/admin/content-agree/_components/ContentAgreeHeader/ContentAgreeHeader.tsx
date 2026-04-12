"use client";

import { DetailHeader } from "@/components/layout";
import Search from "@/components/layout/DetailHeader/DetailHeaderParts/HeaderSearch";
import { useRouter } from "next/navigation";

const ContentAgreeHeader = () => {
  const router = useRouter();

  return (
    <DetailHeader title="콘텐츠 활용 동의 게시글">
      <Search
        onClick={() => {
          router.push("/admin/content-agree/search");
        }}
      />
    </DetailHeader>
  );
};

export default ContentAgreeHeader;
