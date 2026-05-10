import { Suspense } from "react";
import type { Metadata } from "next";
import { formatMetadataKeyword } from "@/utils";
import { PublicDataSearchContent, PublicDataSearchDetailHeader } from "./_components";

interface PageProps {
  searchParams: Promise<{ keyword?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { keyword } = await searchParams;
  const displayKeyword = formatMetadataKeyword(keyword);

  const title = `${displayKeyword} 검색결과`;
  const description = `찾아줘에서 ${displayKeyword}을 찾고 있나요? 경찰청 유실물 센터, lost112에 올라온 ${displayKeyword} 분실물을 찾아보세요!`;

  return {
    title,
    description,
  };
}

const page = () => {
  return (
    <>
      <PublicDataSearchDetailHeader />

      <Suspense fallback={null}>
        <PublicDataSearchContent />
      </Suspense>
    </>
  );
};

export default page;
