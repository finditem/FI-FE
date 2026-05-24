import { Icon } from "@/components";
import Link from "next/link";

const PublicMoreViewCard = () => {
  return (
    <Link
      href="/public-data?type=lost"
      className="flex h-[120px] w-[124px] shrink-0 flex-col gap-3 rounded-2xl border-[0.7px] border-divider-default bg-white px-5 py-[26px]"
    >
      <div className="h-6 w-6 rounded-full border border-labelsVibrant-quaternary flex-center">
        <Icon name="ArrowRightSmall" size={20} className="text-neutralInversed-strong-default" />
      </div>
      <div className="flex flex-col text-caption1-semibold">
        <span className="text-layout-header-default">경찰청 분실물</span>
        <span className="text-brand-strongUseThis-default">더보기</span>
      </div>
    </Link>
  );
};

export default PublicMoreViewCard;
