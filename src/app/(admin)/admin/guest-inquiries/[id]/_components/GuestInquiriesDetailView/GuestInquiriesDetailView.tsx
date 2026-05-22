"use client";

import { Button, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { AdminDetailSection } from "@/app/(admin)/admin/_components";
import { useGetDetailGuestInquiries } from "@/api/fetch/admin";

interface GuestInquiriesDetailViewProps {
  id: number;
}

const GuestInquiriesDetailView = ({ id }: GuestInquiriesDetailViewProps) => {
  const { addToast } = useToast();
  const { data, isLoading, isError } = useGetDetailGuestInquiries({ inquiryId: id });

  if (isLoading) return <LoadingState />;
  if (isError || !data?.result) return null;

  const copyEmail = () => {
    if (!data.result.email) {
      addToast("이메일이 존재하지 않아요", "error");
      return;
    }

    try {
      navigator.clipboard.writeText(data.result.email);
      addToast("이메일을 클립보드에 복사했어요", "success");
    } catch {
      addToast("이메일 복사에 실패했어요", "error");
    }
  };

  return (
    <div className="flex flex-col h-base">
      <article className="flex-1">
        <AdminDetailSection data={data.result} type="inquiry" isGuest={true} />
      </article>

      <div className="sticky bottom-0 border-t border-divider-default bg-white px-5 pb-8 pt-3">
        <Button className="min-h-11 w-full" onClick={copyEmail}>
          이메일 복사하기
        </Button>
      </div>
    </div>
  );
};

export default GuestInquiriesDetailView;
