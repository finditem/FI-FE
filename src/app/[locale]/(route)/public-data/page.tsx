import { Suspense } from "react";
import type { Metadata } from "next";
import { PublicDataView, PublicDetailHeader } from "./_components";

interface PageProps {
  searchParams: Promise<{ type?: string; keyword?: string }>;
}

const getPostType = (type?: string) => {
  if (type === "lost") return "분실한";
  if (type === "found") return "습득한";
  return "분실한";
};

const getPostDescription = (type?: string) => {
  if (type === "lost") return "분실물";
  if (type === "found") return "습득물";
  return "분실물";
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { type, keyword } = await searchParams;

  let title = "";
  let description = "";

  const postType = getPostType(type);
  const postDescription = getPostDescription(type);

  if (!!keyword) {
    title = `${keyword} 검색결과 | 찾아줘!`;
    description = `찾아줘에서 ${keyword}을 찾고 있나요? 경찰청 유실물 센터, lost112에 올라온 ${keyword} 분실물을 찾아보세요!`;
  } else {
    title = `경찰청 ${postType} 물건`;
    description = `경찰청 유실물 센터, lost112에 올라온 ${postDescription} 데이터를 더욱 쉽게 확인해보세요.`;
  }

  return {
    title,
    description,
  };
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <PublicDetailHeader />

      <PublicDataView />
    </Suspense>
  );
};

export default page;
