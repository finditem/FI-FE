"use client";

import { useNotificationList } from "@/api/fetch/notification";
import { DetailHeader, HeaderDelete, HeaderSetting } from "@/components";
import { useRouter } from "next/navigation";

const AlertDetailHeader = ({
  isDeleteMode,
  setIsDeleteMode,
}: {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
}) => {
  const router = useRouter();
  const { data: notifications, isPending } = useNotificationList();
  const isDeleteDisabled = isPending || (notifications?.length ?? 0) === 0;

  return (
    <>
      <DetailHeader title="알림">
        <HeaderDelete
          isDeleteMode={isDeleteMode}
          setIsDeleteMode={setIsDeleteMode}
          disabled={isDeleteDisabled}
        />
        <HeaderSetting onClick={() => router.push("/mypage/notifications")} />
      </DetailHeader>
      <h1 className="sr-only">알림 페이지</h1>
    </>
  );
};

export default AlertDetailHeader;
