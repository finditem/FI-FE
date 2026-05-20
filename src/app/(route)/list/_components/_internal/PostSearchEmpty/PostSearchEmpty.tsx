import Link from "next/link";
import { Button } from "@/components/common";
import { EmptyState } from "@/components/state";

const sanitizeKeyword = (keyword?: string) => {
  if (!keyword) return "물건";

  return keyword.replace(/[<>]/g, "").slice(0, 20);
};

const PostSearchEmpty = ({ keyword }: { keyword?: string }) => {
  const displayKeyword = sanitizeKeyword(keyword);

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto">
      <EmptyState
        className="flex-1"
        icon={{
          iconName: "EmptyPostSearch",
          iconSize: 70,
        }}
        title="검색 결과가 없습니다."
        description={"입력한 내용을 다시 한 번 확인해 주세요."}
      />

      <div className={keyword ? "visible" : "invisible"}>
        <div className="flex flex-col items-start gap-6">
          <p className="flex flex-col gap-3 px-5 text-h2-bold text-layout-header-default">
            <span>
              방금 검색한 <span className="text-brand-strongUseThis-default">{displayKeyword}</span>
              을
            </span>
            <span>경찰청 분실물 목록에서 다시 찾아볼까요?</span>
          </p>

          <div className="w-full border-t border-divider-default px-4 pb-8 pt-3">
            <Button as={Link} href="/public-data" className="w-full">
              경찰청 목록에서 찾아보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSearchEmpty;
