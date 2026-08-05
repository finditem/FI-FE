"use client";

import { BlockUserItem, useDeleteBlockUser, useGetBlockUser } from "@/api/fetch/report";
import { Button, ProfileAvatar, EmptyState, LoadingState } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { useEffect } from "react";

const ReportUserList = () => {
  const { addToast } = useToast();
  const {
    data: blockUserList,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetBlockUser();
  const { ref } = useInfiniteScroll({ hasNextPage, fetchNextPage, isFetchingNextPage });

  useEffect(() => {
    if (isError) addToast("차단된 유저 데이터를 가져오는데 실패했어요", "error");
  }, [isError, addToast]);

  return isLoading ? (
    <LoadingState />
  ) : blockUserList?.length === 0 ? (
    <EmptyState
      icon={{ iconName: "NoComments", iconSize: 70 }}
      title="차단한 유저가 없어요"
      description={"아직 차단한 유저가 없습니다.\n유저를 차단하면 이곳에 표기됩니다."}
    />
  ) : (
    <ul className="flex flex-col gap-3 py-4">
      {blockUserList?.map((item) => (
        <ReportUserItem key={item.userId} data={item} />
      ))}
      <div ref={ref} className="h-[100px]" />
    </ul>
  );
};

export default ReportUserList;

const ReportUserItem = ({ data }: { data: BlockUserItem }) => {
  const { profileImage, nickname, userId } = data;
  const { mutateAsync: deleteBlockUser } = useDeleteBlockUser();

  const handleDeleteBlockUser = () => {
    deleteBlockUser({ userId });
  };

  return (
    <li className="flex items-center justify-between px-5 py-2">
      <div className="flex items-center gap-3">
        <ProfileAvatar src={profileImage} alt={nickname} size={36} />
        <p className="text-body1-medium text-layout-header-default">{nickname}</p>
      </div>

      <Button
        variant="outlined"
        ariaLabel={`${nickname} 차단 해제`}
        className="px-3"
        onClick={handleDeleteBlockUser}
      >
        차단 해제
      </Button>
    </li>
  );
};
