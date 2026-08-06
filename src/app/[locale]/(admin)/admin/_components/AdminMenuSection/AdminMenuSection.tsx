import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components";
import { ADMIN_NAV_SECTIONS } from "../../_constants/ADMIN_NAV_SECTIONS";
import { AdminLogoutButton } from "../_internal";

const AdminMenuSection = () => {
  return (
    <nav aria-label="관리자 메뉴" className="flex flex-col gap-[6px]">
      {ADMIN_NAV_SECTIONS.map((section, index) => (
        <Fragment key={section.id}>
          <AdminSectionNavItem
            label={section.label}
            items={section.items}
            footer={section.id === "account" && <AdminLogoutButton />}
          />

          {index < ADMIN_NAV_SECTIONS.length - 1 && <hr aria-hidden className="mx-5" />}
        </Fragment>
      ))}
    </nav>
  );
};

export default AdminMenuSection;

interface AdminSectionNavItemType {
  href: string;
  title: string;
}

interface AdminSectionNavItemProps {
  label: string;
  items: readonly AdminSectionNavItemType[];
  footer?: ReactNode;
}

const AdminSectionNavItem = ({ label, items, footer }: AdminSectionNavItemProps) => {
  return (
    <section aria-label={label} className="flex flex-col gap-[2px] px-5 py-6">
      <h2 className="text-body2-regular text-layout-body-default">{label}</h2>

      <ul>
        {items.map(({ href, title }) => (
          <li key={href}>
            <Link href={href} className="flex items-center justify-between py-[10px]">
              <span className="text-body1-semibold text-neutral-strong-default">{title}</span>
              <Icon name="ArrowRightSmall" size={24} className="text-neutral-strong-default" />
            </Link>
          </li>
        ))}

        {footer && <li>{footer}</li>}
      </ul>
    </section>
  );
};
