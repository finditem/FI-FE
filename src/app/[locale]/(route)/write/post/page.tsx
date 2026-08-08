import { Suspense } from "react";
import type { Metadata } from "next";
import { WritePage } from "./_components";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { type } = await searchParams;

  let title = "물건 등록";
  let description = "분실 또는 발견한 물건의 정보를 등록해보세요.";

  if (type === "lost") {
    title = "분실한 물건 등록";
    description = "분실한 물건의 정보를 등록해보세요.";
  } else {
    title = "발견한 물건 등록";
    description = "발견한 물건의 정보를 등록해보세요.";
  }

  return {
    title,
    description,
  };
}

const Page = () => {
  return (
    <Suspense fallback={null}>
      <WritePage />
    </Suspense>
  );
};

export default Page;
