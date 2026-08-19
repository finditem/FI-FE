import { Icon, IconName } from "@/components";
import Link from "next/link";
import { useMypageTapConfig } from "../../_hooks/useMypageTapConfig/useMypageTapConfig";
import { cn } from "@/utils";

interface MyPageTapItemProps {
  pageName: string;
  iconName: IconName;
  pageLink: string;
  disabled?: boolean;
  isLast: boolean;
}

const MyPageIconNavItem = ({
  pageName,
  iconName,
  pageLink,
  disabled,
  isLast,
}: MyPageTapItemProps) => {
  return (
    <>
      <Link
        href={pageLink}
        className={cn("w-full gap-2 py-4 flex-col-center", disabled && "pointer-events-none")}
      >
        <Icon name={iconName} size={24} />
        <span className="whitespace-nowrap px-[50px] text-body2-medium text-neutral-strong-default">
          {pageName}
        </span>
      </Link>
      {!isLast && <hr className="h-[46px] border border-divider-default_3" />}
    </>
  );
};

const MyPageIconNav = ({ disabled }: { disabled?: boolean }) => {
  const tapConfig = useMypageTapConfig();

  return (
    <div className="w-full gap-[26px] px-5 py-[6px] flex-center">
      {tapConfig.map((item, index) => (
        <MyPageIconNavItem
          key={item.key}
          pageName={item.pageName}
          iconName={item.iconName}
          pageLink={item.pageLink}
          disabled={disabled}
          isLast={index === tapConfig.length - 1}
        />
      ))}
    </div>
  );
};
export default MyPageIconNav;
