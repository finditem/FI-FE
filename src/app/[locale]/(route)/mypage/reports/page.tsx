import { DetailHeader, MypageSearch } from "@/components";
import { MypageReportsContent, MypageReportsFilter } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="내 신고 내역" />
      <h1 className="sr-only">내 신고 내역 페이지</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="reports" />

        <MypageReportsFilter />

        <MypageReportsContent />
      </div>
    </>
  );
};

export default page;
