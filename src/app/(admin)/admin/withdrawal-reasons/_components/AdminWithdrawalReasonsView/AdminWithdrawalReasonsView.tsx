"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { PopupLayout, Button, RadioOptionItem } from "@/components";
import { AdminFilter, AdminSearch } from "../../../_components";
import { WITHDRAWAL_REASON_OPTIONS } from "../../_constants/WITHDRAWAL_REASON_OPTIONS";
import { WithdrawalReasonType } from "../../_types/WithdrawalReasonType";
import AdminWithdrawalReasonList from "../AdminWithdrawalReasonList/AdminWithdrawalReasonList";

const AdminWithdrawalReasonsView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [reason, setReason] = useState<WithdrawalReasonType>("");
  const [pendingReason, setPendingReason] = useState<WithdrawalReasonType | null>(null);

  const WithdrawalReasonsFilters = [
    {
      label: WITHDRAWAL_REASON_OPTIONS.find((option) => option.value === reason)?.label ?? "유형",
      onSelected: !!reason,
      onClick: () => setPendingReason(reason),
    },
  ];

  const handleApply = () => {
    setReason(pendingReason as WithdrawalReasonType);
    setPendingReason(null);
  };

  const handleSearch = (newKeyword: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newKeyword) {
      params.set("keyword", newKeyword);
    } else {
      params.delete("keyword");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <>
      <div className="h-base">
        <AdminSearch
          placeholder="유저 이메일 또는 사유를 작성해 주세요."
          onEnter={handleSearch}
          defaultValue={keyword}
        />

        <AdminFilter filters={WithdrawalReasonsFilters} />

        <ErrorBoundary toastMessage="유저 탈퇴 사유를 불러오지 못했어요">
          <AdminWithdrawalReasonList reason={reason} keyword={keyword} />
        </ErrorBoundary>
      </div>

      {pendingReason !== null && (
        <PopupLayout
          isOpen={pendingReason !== null}
          onClose={() => setPendingReason(null)}
          className="w-full gap-8 px-5 py-10 flex-col-center"
        >
          <h2 className="text-h2-medium text-layout-header-default">탈퇴 유형 선택</h2>
          <div className="w-full">
            {WITHDRAWAL_REASON_OPTIONS.map((option) => (
              <RadioOptionItem
                key={option.value}
                option={option}
                selected={pendingReason}
                onChange={(value) => setPendingReason(value as WithdrawalReasonType)}
                inputName="withdrawalReason"
              />
            ))}
          </div>
          <Button className="w-full" onClick={handleApply}>
            적용하기
          </Button>
        </PopupLayout>
      )}
    </>
  );
};

export default AdminWithdrawalReasonsView;
