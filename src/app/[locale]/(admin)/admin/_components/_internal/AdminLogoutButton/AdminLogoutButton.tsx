"use client";

import { useLogout } from "@/hooks";
import { cn } from "@/utils";

const AdminLogoutButton = () => {
  const { handleLogout, isPending } = useLogout();

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between py-[10px]",
        isPending && "cursor-not-allowed"
      )}
      onClick={handleLogout}
      disabled={isPending}
    >
      <span className="text-body1-semibold text-neutral-strong-default">로그아웃</span>
    </button>
  );
};
export default AdminLogoutButton;
