import type { Metadata } from "next";
import { Suspense } from "react";
import { DefaultListView } from "./_components";

interface PageProps {
  searchParams: Promise<{ type?: string; keyword?: string }>;
}

const getPostType = (type?: string) => {
  if (type === "lost") return "분실한";
  if (type === "found") return "발견된";
  return "분실한";
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { type, keyword } = await searchParams;

  const postType = getPostType(type);

  let title = "";
  let description = "";

  if (keyword) {
    title = `${keyword} 검색결과`;
    description = `찾아줘에서 ${keyword}을 찾고 있나요? 우리 동네에서 잃어버린 ${keyword} 분실물을 찾아보세요!`;
  } else {
    title = `${postType} 물건 리스트`;
    description = `${postType} 물건을 한눈에 확인해보세요! 우리 동네 분실물들이 이곳에 모여 있어요.`;
  }

  return {
    title,
    description,
  };
}

const Page = () => {
  return (
    <Suspense fallback={null}>
      <DefaultListView />
    </Suspense>
  );
};

export default Page;
