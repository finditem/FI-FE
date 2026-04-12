import {
  NotificationListItem,
  useNotificationList,
  useNotificationRead,
} from "@/api/fetch/notification";
import { ALERT_ROW_BG } from "@/app/(route)/alert/_constants/ALERT_ROW_BG";
import { alertRouteUrl } from "@/app/(route)/alert/_utils/alertRouteUrl";
import { getAlertTitleSegments } from "@/app/(route)/alert/_utils/alertTitleSegments";
import { getAlertIconBackgroundColor } from "@/app/(route)/alert/_utils/alertViewMappers";
import { CheckBox, Icon } from "@/components/common";
import { IconName } from "@/components/common/Icon/Icon";
import { EmptyState } from "@/components/state";
import { useInfiniteScroll } from "@/hooks";
import { cn, formatDate } from "@/utils";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";

interface AlertItemProps {
  item: NotificationListItem;
  isDeleteMode: boolean;
  selectedNotifications: number[];
  setSelectedNotifications: Dispatch<SetStateAction<number[]>>;
}

const AlertItem = ({
  item,
  isDeleteMode,
  selectedNotifications,
  setSelectedNotifications,
}: AlertItemProps) => {
  const router = useRouter();
  const {
    notificationId,
    type,
    title,
    message,
    referenceType,
    referenceId,
    isRead,
    createdAt,
    roomId,
  } = item;
  const { mutate: readNotification } = useNotificationRead();
  const { icon, bg } = getAlertIconBackgroundColor(type, referenceType);
  const titleSegments = getAlertTitleSegments(type, title);
  const IconSize = referenceType === "NOTICE" && type !== "COMMENT" ? 20 : 15;
  const isSelected = selectedNotifications.includes(notificationId);

  const handleSelectNotification = (id: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleRowClick = () => {
    if (isDeleteMode) {
      handleSelectNotification(notificationId);
      return;
    }
    readNotification({ ids: [notificationId] });
    router.push(alertRouteUrl(referenceType, referenceId, roomId));
  };

  return (
    <button
      type="button"
      onClick={handleRowClick}
      aria-label={
        isDeleteMode
          ? isSelected
            ? "선택된 알림, 탭하면 선택 해제"
            : "알림 선택"
          : "알림 확인, 외부 페이지 이동"
      }
      className={cn(
        "flex min-h-[86px] w-full items-start gap-3 border-b border-divider-default p-5 text-left transition-colors",
        "cursor-pointer",
        isRead
          ? ALERT_ROW_BG.read[isDeleteMode ? "delete" : "default"]
          : ALERT_ROW_BG.unread[isDeleteMode ? "delete" : "default"]
      )}
    >
      {isDeleteMode && (
        <span
          className="flex shrink-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CheckBox
            id={String(notificationId)}
            checked={isSelected}
            label=""
            boxSize="size-6"
            onChange={() => handleSelectNotification(notificationId)}
          />
        </span>
      )}
      <div className={cn("size-[30px] flex-shrink-0 rounded-full flex-center", bg)}>
        <Icon name={icon as IconName} size={IconSize} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <div className="min-w-0 flex-1 truncate text-body2-medium text-neutral-normal-default">
            {titleSegments.map((seg, i) => (
              <span key={i} className={cn(seg.emphasize && "text-brand-normal-default")}>
                {seg.text}
              </span>
            ))}
          </div>
          <span className="shrink-0 text-caption1-regular text-neutral-normal-placeholder">
            {formatDate(createdAt)}
          </span>
        </div>
        <span className="min-w-0 truncate text-body2-regular text-neutral-strong-default">
          {message}
        </span>
      </div>
    </button>
  );
};

interface AlertListProps {
  isDeleteMode: boolean;
  selectedNotifications: number[];
  setSelectedNotifications: Dispatch<SetStateAction<number[]>>;
}

const AlertList = ({
  isDeleteMode,
  selectedNotifications,
  setSelectedNotifications,
}: AlertListProps) => {
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationList();

  const { ref: alertListRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (notifications?.length === 0) {
    return (
      <EmptyState
        icon={{ iconName: "AlertBell", iconSize: 70 }}
        title="아직 새 소식이 없어요"
        description={`주변을 계속 살펴보고 있어요.\n새로운 알림이 생기면 바로 알려드릴게요.`}
      />
    );
  }

  return (
    <>
      {notifications?.map((item) => (
        <AlertItem
          key={item.notificationId}
          item={item}
          isDeleteMode={isDeleteMode}
          selectedNotifications={selectedNotifications}
          setSelectedNotifications={setSelectedNotifications}
        />
      ))}
      {hasNextPage && <div ref={alertListRef} className="h-[100px]" />}
    </>
  );
};

export default AlertList;
