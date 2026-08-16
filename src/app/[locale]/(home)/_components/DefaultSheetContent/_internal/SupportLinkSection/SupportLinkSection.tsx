import { Icon } from "@/components";
import Link from "next/link";
import useSupportMenuItems from "../../../../_hooks/useSupportMenuItems/useSupportMenuItems";

const SupportLinkSection = () => {
  const supportMenuItems = useSupportMenuItems();

  return (
    <section className="w-full">
      {supportMenuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center justify-between px-1 py-2"
        >
          <span className="text-body1-medium text-layout-header-default">{item.label}</span>
          <Icon name="ArrowRightSmall" size={20} className="text-neutral-normal-disabled" />
        </Link>
      ))}
    </section>
  );
};

export default SupportLinkSection;
