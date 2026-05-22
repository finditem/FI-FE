"use client";

import { useGetUserInquiryById } from "@/api/fetch/inquiry";
import { LoadingState, Chip, ImageViewerModal } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import { INQUIRY_STATUS_CHIP } from "../../../_constants/INQUIRY_STATUS_CHIP";
import { formatDate } from "@/utils";
import Image from "next/image";
import InquiryCommentItem from "../InquiryCommentItem/InquiryCommentItem";
import InquiryInputComment from "../InquiryInputComment/InquiryInputComment";

interface MypageInquiriesIdContainerProps {
  id: number;
}

const MypageInquiriesIdContainer = ({ id }: MypageInquiriesIdContainerProps) => {
  const { data: reportIdData, isError, isLoading } = useGetUserInquiryById({ inquiryId: id });
  const { addToast } = useToast();

  const [imageViewerState, setImageViewerState] = useState<{
    isOpen: boolean;
    initialIndex: number;
  }>({ isOpen: false, initialIndex: 0 });

  useEffect(() => {
    if (isError) addToast("문의 내역을 불러오는데 실패했어요", "error");
  }, [isError, addToast]);

  const result = reportIdData?.result;

  return (
    <div className="flex w-full flex-col h-base">
      {isLoading ? (
        <LoadingState />
      ) : (
        result && (
          <>
            <div className="border-b-flat-gray-50 flex w-full flex-col gap-[14px] border-b px-5 py-[30px]">
              <div>
                <Chip
                  label={INQUIRY_STATUS_CHIP[result.status].label}
                  type={INQUIRY_STATUS_CHIP[result.status].chipType}
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-h2-medium">{result.title}</h2>
                  <time
                    dateTime={result.createdAt}
                    className="mt-1 text-body2-regular text-layout-body-default"
                  >
                    {formatDate(result.createdAt)}
                  </time>
                </div>

                <p className="inline-block text-body1-regular text-layout-header-default">
                  {result.content}
                </p>

                <div className="gap-[14px] flex-col-center">
                  {result.imageUrls &&
                    result.imageUrls.length > 0 &&
                    result.imageUrls.map((imageUrl, index) => (
                      <Image
                        key={index}
                        alt={`이미지 ${index + 1}`}
                        src={imageUrl}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                        className="cursor-pointer"
                        aria-label={`${index + 1}번째 이미지 보기`}
                        onClick={() => setImageViewerState({ isOpen: true, initialIndex: index })}
                      />
                    ))}
                </div>
              </div>

              <ImageViewerModal
                images={result.imageUrls || []}
                initialIndex={imageViewerState.initialIndex}
                isOpen={imageViewerState.isOpen}
                onClose={() => setImageViewerState((prev) => ({ ...prev, isOpen: false }))}
              />
            </div>

            {/* 댓글 목록 */}
            {result.comments && (
              <ul className="flex flex-col">
                {result.comments.map((item) => (
                  <li key={item.id} className="border-b last:border-b-0">
                    <InquiryCommentItem data={item} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )
      )}

      {!isLoading && <InquiryInputComment id={id} />}
    </div>
  );
};

export default MypageInquiriesIdContainer;
