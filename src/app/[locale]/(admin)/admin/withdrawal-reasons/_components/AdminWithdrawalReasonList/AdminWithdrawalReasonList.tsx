"use client";

import { useEffect } from "react";
import { useGetDeletedUsers, WithdrawUserItem } from "@/api/fetch/admin";
import { EmptyState, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { formatDate } from "@/utils";
import { WITHDRAWAL_REASON_OPTIONS } from "../../_constants/WITHDRAWAL_REASON_OPTIONS";
import { WithdrawalReasonType } from "../../_types/WithdrawalReasonType";

const AdminWithdrawalReasonList = ({
  reason,
  keyword,
}: {
  reason: WithdrawalReasonType;
  keyword: string;
}) => {
  const { addToast } = useToast();

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetDeletedUsers({
      reason,
      keyword,
    });
  const { ref: listRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useEffect(() => {
    if (isError) addToast("유저 탈퇴 사유를 불러오지 못했어요", "error");
  }, [isError, addToast]);

  if (isLoading)
    return <LoadingState title={keyword ? "검색하신 내용을 찾고 있어요" : undefined} />;
  if (isError) return null;

  const isEmpty = data?.length === 0;

  if (isEmpty) {
    const emptyContent = keyword
      ? {
          title: "선택한 조건에 맞는 탈퇴 내역이 없어요",
          description:
            "선택하신 조건에 해당하는 탈퇴 내역이 없습니다.\n다른 조건으로 다시 조회해 주세요.",
        }
      : {
          title: "탈퇴한 유저가 없어요",
          description: "아직 탈퇴한 유저가 없습니다.\n탈퇴 내역이 발생하면 이곳에 표기됩니다.",
        };

    return (
      <EmptyState
        icon={{
          iconName: "NoWithdrawalAdmin",
          iconSize: 70,
        }}
        title={emptyContent.title}
        description={emptyContent.description}
      />
    );
  }

  return (
    <section aria-label="유저 탈퇴 사유 목록">
      <ul>
        {data?.map((item) => (
          <WithdrawalReasonItem key={item.userId} data={item} />
        ))}
      </ul>
      {hasNextPage && <div ref={listRef} className="h-10 w-full" />}
    </section>
  );
};

export default AdminWithdrawalReasonList;

const WithdrawalReasonItem = ({ data }: { data: WithdrawUserItem }) => {
  return (
    <li className="block space-y-2 border-b border-divider-default px-5 py-[30px]">
      <div className="space-y-1">
        <h3 className="text-h3-semibold text-layout-header-default">{data.nickname}</h3>
        <div className="flex text-body2-regular text-layout-body-default">
          <span className="after:mx-1 after:content-['·']">{data.email}</span>
          <time dateTime={data.deletedAt}>{formatDate(data.deletedAt)}</time>
        </div>
      </div>
      <div className="text-body1-regular text-brand-normal-default">
        <ul className="space-y-[2px]">
          {data.withdrawalReason?.split(",").map((reason, index) => (
            <li key={index}>
              -{" "}
              {reason === "OTHER"
                ? `(기타) ${data.withdrawalOtherReason ?? ""}`
                : (WITHDRAWAL_REASON_OPTIONS.find((opt) => opt.value === reason)?.label ??
                  "확인할 수 없어요.")}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};
