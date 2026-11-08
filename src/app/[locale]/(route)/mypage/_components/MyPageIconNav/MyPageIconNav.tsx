import { Icon, IconName } from "@/components";
import { Link } from "@/i18n/navigation";
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
        className={cn("flex-1 gap-2 flex-col-center", disabled && "pointer-events-none")}
      >
        <Icon name={iconName} size={24} className="text-layout-body-default" />
        <span className="whitespace-nowrap text-body2-medium text-neutral-strong-default">
          {pageName}
        </span>
      </Link>
      {!isLast && <hr className="h-9 border border-neutral-strong-default" />}
    </>
  );
};

const MyPageIconNav = ({ disabled }: { disabled?: boolean }) => {
  const tapConfig = useMypageTapConfig();

  return (
    <div className="flex w-full items-center rounded-[16px] bg-white py-4">
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
