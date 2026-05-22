"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ReportModal, DetailHeader, HeaderMenu } from "@/components";
import { cn } from "@/utils";
import { useGetUsersMe } from "@/api/fetch/user";
import { usePopoverOutsideClose } from "@/hooks";

const UserProfileDetailHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const { userId } = useParams<{ userId: string }>();
  const menuWrapperRef = useRef<HTMLDivElement>(null);
  const { data: me } = useGetUsersMe();

  const isMyProfile = me?.result?.userId?.toString() === userId;

  usePopoverOutsideClose(isMenuOpen, menuWrapperRef, menuWrapperRef, () => setIsMenuOpen(false));

  return (
    <div className="relative">
      <DetailHeader title="프로필">
        {!isMyProfile && (
          <div className="relative" ref={menuWrapperRef}>
            <HeaderMenu ariaLabel="더보기 메뉴" onClick={() => setIsMenuOpen((prev) => !prev)} />

            {isMenuOpen && me && (
              <button
                type="button"
                className={cn(
                  "absolute right-0 top-full z-10 mt-2",
                  "border border-white bg-fill-neutral-subtle-default",
                  "h-[57px] w-[119px] rounded-[20px] px-7 py-4 shadow-sm",
                  "text-nowrap"
                )}
                onClick={() => setIsReportOpen(true)}
              >
                <span className="text-h3-medium text-system-warning">신고하기</span>
              </button>
            )}
          </div>
        )}
      </DetailHeader>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="USER"
        targetId={Number(userId)}
      />
    </div>
  );
};

export default UserProfileDetailHeader;
