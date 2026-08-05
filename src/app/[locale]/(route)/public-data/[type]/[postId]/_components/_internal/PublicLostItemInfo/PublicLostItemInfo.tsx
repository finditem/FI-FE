interface PublicLostItemInfoProps {
  date: string;
  isLost: boolean;
}

const PublicLostItemInfo = ({ date, isLost }: PublicLostItemInfoProps) => {
  const dateLabel = isLost ? "분실일" : "습득일";

  return (
    <ul
      aria-label={`${dateLabel} 정보`}
      className="flex flex-col gap-1 rounded-[24px] px-5 py-4 text-body1-regular text-layout-header-default bg-fill-neutral-strong-enteredSelected"
    >
      <li>
        {dateLabel}: {date}
      </li>
    </ul>
  );
};

export default PublicLostItemInfo;
