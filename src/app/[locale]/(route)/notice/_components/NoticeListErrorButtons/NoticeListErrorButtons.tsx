"use client";

import { Button } from "@/components";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const NoticeListErrorButtons = () => {
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="outlined"
        size="big"
        ignoreBase
        className="h-11 w-24 rounded-[10px] border border-brand-normal-default text-body1-semibold text-brand-normal-default flex-center"
        onClick={() => queryClient.refetchQueries({ queryKey: ["notices"] })}
      >
        새로고침
      </Button>
      <Button variant="outlined" size="big" as={Link} href="/inquiry-write">
        고객센터 문의
      </Button>
    </div>
  );
};

export default NoticeListErrorButtons;
