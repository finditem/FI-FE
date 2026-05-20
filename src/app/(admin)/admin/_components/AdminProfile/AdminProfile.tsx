"use client";

import Link from "next/link";
import { Button, ProfileAvatar } from "@/components";
import { useGetUsersMe } from "@/api/fetch/user";
import { SkeletonAdminProfile } from "../_internal";

const AdminProfile = () => {
  const { data, isLoading } = useGetUsersMe();
  const { email, nickname, profileImg } = data?.result || {};

  return (
    <header className="flex items-center justify-between px-5 py-[30px]">
      {isLoading ? (
        <SkeletonAdminProfile />
      ) : (
        <div className="flex items-center gap-6">
          <ProfileAvatar src={profileImg} alt={nickname} size={60} priority />
          <div>
            <p className="text-body1-semibold text-layout-header-default">{nickname}</p>
            <span className="text-body2-regular text-layout-body-default">{email}</span>
          </div>
        </div>
      )}

      <Button
        as={Link}
        href="/admin/profile"
        aria-label="관리자 프로필 수정"
        variant="outlined"
        size="small"
      >
        프로필 수정
      </Button>
    </header>
  );
};

export default AdminProfile;
