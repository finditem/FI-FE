"use client";

import { NOTIFICATION_TYPE } from "@/api/fetch/notification";
import { cn } from "@/utils";
import { FOOTER_ITEM_BASE_STYLE } from "../../_constants/CONST_FOOTER";
import { Icon } from "@/components/common";
import LoginRequiredNotice from "../LoginRequiredNotice/LoginRequiredNotice";
import Link from "next/link";
import type useFooterNav from "../../_hooks/useFooterNav";
import { useNotificationStore } from "@/store";

interface FooterItemProps {
  item: ReturnType<typeof useFooterNav>["items"][number];
}

interface NotificationDotProps {
  link: FooterItemProps["item"]["link"];
  href: FooterItemProps["item"]["href"];
  hasUnreadNotification: boolean;
  unreadNotificationTypes: ReturnType<
    typeof useNotificationStore.getState
  >["unreadNotificationTypes"];
}

const NotificationDot = ({
  link,
  href,
  hasUnreadNotification,
  unreadNotificationTypes,
}: NotificationDotProps) => {
  if (!("alert" in link && link.alert)) return null;

  const isChatItem = href === "/chat";
  const isAlertItem = href === "/alert";

  const hasUnreadChatNotification = unreadNotificationTypes.some(
    (type) => type === NOTIFICATION_TYPE.CHAT || type === NOTIFICATION_TYPE.CHAT_REMINDER
  );

  const shouldShowDot =
    (isChatItem && hasUnreadChatNotification) || (isAlertItem && hasUnreadNotification);

  if (!shouldShowDot) return null;

  return <div className={cn("footer-alert-dot", link.alert)} />;
};

const FooterItem = ({ item }: FooterItemProps) => {
  const { hasUnreadNotification, unreadNotificationTypes } = useNotificationStore();
  const {
    link,
    label,
    href,
    linkHref,
    isActive,
    isLoginRequiredDisabled,
    showLoginRequiredNotice,
    onClick,
  } = item;
  const iconClassName = isActive ? "text-brand-normal-pressed" : "text-labelsVibrant-quaternary";

  return (
    <Link
      href={linkHref}
      aria-disabled={isLoginRequiredDisabled}
      className={cn(
        FOOTER_ITEM_BASE_STYLE,
        !isLoginRequiredDisabled && "hover:text-neutral-strong-focused",
        link.requiresLogin && "relative overflow-visible"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Icon
          name={link.icon}
          size={28}
          className={cn(
            iconClassName,
            !isLoginRequiredDisabled && "group-hover:text-brand-normal-pressed"
          )}
        />
        <NotificationDot
          link={link}
          href={href}
          hasUnreadNotification={hasUnreadNotification}
          unreadNotificationTypes={unreadNotificationTypes}
        />
      </div>
      <span className={cn("py-[2px]", isActive)}>{label}</span>
      {isLoginRequiredDisabled && showLoginRequiredNotice ? <LoginRequiredNotice /> : null}
    </Link>
  );
};

export default FooterItem;
