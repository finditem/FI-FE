import { DetailHeader } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "분실물/습득물/도난 매뉴얼",
  description:
    "분실, 습득, 도난 상황에서 해결법을 찾으시나요? 유형별 신고 절차와 센터까지 정리했으니, 차분하게 대처해보세요!",
  other: { "page-type": "manual" },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DetailHeader title="유실물 발생 시 매뉴얼" />
      <h1 className="sr-only">매뉴얼 페이지</h1>
      <section className="w-full h-base">{children}</section>
    </>
  );
};

export default layout;
