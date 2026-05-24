import { Icon } from "@/components";
import { RecentSearchItem } from "../../_types/PublicRecentSearchItem";

interface PublicDataBeforeSearchProps {
  recentSearches: RecentSearchItem[];
  removeSearch: (keyword: string) => void;
  onSearch: (keyword: string) => void;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
};

const PublicDataBeforeSearch = ({
  recentSearches,
  removeSearch,
  onSearch,
}: PublicDataBeforeSearchProps) => {
  const isEmpty = recentSearches.length === 0;

  if (isEmpty) {
    return (
      <section className="gap-5 py-3 flex-col-center">
        <div className="rounded-full p-[6px] bg-fill-neutral-strong-default">
          <Icon name="Clock" size={20} />
        </div>
        <p className="text-body1-regular text-labelsVibrant-primary">최근 검색한 기록이 없어요.</p>
      </section>
    );
  }

  return (
    <section className="px-5 pt-3">
      <ul>
        {recentSearches.map((item) => (
          <li
            key={item.keyword}
            className="flex items-center justify-between border-b border-labelsVibrant-quaternary py-4"
          >
            <button
              type="button"
              onClick={() => onSearch(item.keyword)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <div className="rounded-full p-[6px] bg-fill-neutral-strong-default">
                <Icon name="Clock" size={20} />
              </div>
              <p className="text-body1-regular text-labelsVibrant-primary">{item.keyword}</p>
            </button>
            <div className="flex items-center gap-[9px] pl-2">
              <time
                dateTime={new Date(item.timestamp).toISOString().split("T")[0]}
                className="text-body1-regular text-labelsVibrant-primary"
              >
                {formatDate(item.timestamp)}
              </time>
              <button type="button" onClick={() => removeSearch(item.keyword)}>
                <Icon name="XSecond" size={20} className="text-neutral-normal-default" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PublicDataBeforeSearch;
