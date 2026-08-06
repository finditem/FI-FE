import { Icon } from "@/components";

const RecentSearchEmpty = () => {
  return (
    <div role="status" className="w-full gap-5 py-3 flex-col-center">
      <div className="h-[32px] w-[32px] flex-shrink-0 rounded-full bg-fill-neutral-strong-default flex-center">
        <Icon name="Clock" size={20} />
      </div>
      <p className="text-body1-regular text-labelsVibrant-primary">최근 검색한 기록이 없어요.</p>
    </div>
  );
};

export default RecentSearchEmpty;
