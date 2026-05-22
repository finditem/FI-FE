import { DetailHeader, MypageSearch } from "@/components";
import { MypageCommentsContent, MypageCommentsFilterSection } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="내가 쓴 댓글" />
      <h1 className="sr-only">내가 쓴 댓글 페이지</h1>
      <div className="w-full h-base">
        <MypageSearch searchMode="comments" />

        <MypageCommentsFilterSection />

        <MypageCommentsContent />
      </div>
    </>
  );
};

export default page;
