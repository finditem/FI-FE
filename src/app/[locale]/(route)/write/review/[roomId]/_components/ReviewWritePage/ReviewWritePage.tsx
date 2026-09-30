"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { DetailHeader } from "@/components/layout";
import { Button, InputField } from "@/components/common";
import useGetChatRoom from "@/api/fetch/chatRoom/api/useGetChatRoom";
import { useGetUsersMe } from "@/api/fetch/user";
import ReviewFeelingSelect, {
  ReviewFeelingValue,
} from "./_internal/ReviewFeelingSelect/ReviewFeelingSelect";
import ReviewHelpChecklist, {
  ReviewHelpItemValue,
} from "./_internal/ReviewHelpChecklist/ReviewHelpChecklist";

interface ReviewFormValues {
  content: string;
}

interface ReviewWritePageProps {
  roomId: number;
}

/**
 * 찾길 후기 작성 페이지입니다. 채팅 상세의 "분실물 찾기 완료" 확인 모달에서 "후기 남기기"를 눌렀을 때
 * 진입합니다.
 *
 * @remarks
 * 후기 등록 백엔드 API가 아직 없어 제출 동작은 이번 범위에서 제외했습니다 — 구조와 로컬 입력 상태까지만
 * 구현되어 있습니다.
 *
 * @author suhyeon
 */

const ReviewWritePage = ({ roomId }: ReviewWritePageProps) => {
  const t = useTranslations("ReviewWritePage");
  const { data: chatRoom } = useGetChatRoom({ roomId });
  const { data: userInfo } = useGetUsersMe();
  const [feeling, setFeeling] = useState<ReviewFeelingValue | null>(null);
  const [helpItems, setHelpItems] = useState<ReviewHelpItemValue[]>([]);
  const methods = useForm<ReviewFormValues>({
    mode: "onChange",
    defaultValues: { content: "" },
  });

  const myNickname = userInfo?.result?.nickname ?? "";
  const opponentNickname = chatRoom?.result.opponentUser.nickname ?? "";
  // 감정 유형(1개)과 도움 경험(1개 이상)은 필수, 상세 후기는 선택 입력이다.
  const canSubmit = feeling !== null && helpItems.length > 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <DetailHeader title={t("title")} />

      <div className="flex flex-1 flex-col gap-10 px-5 py-6">
        <div className="flex flex-col gap-7">
          <p className="gap-2 whitespace-pre-line text-h2-bold text-labelsVibrant-primary">
            {t("greeting", { myNickname, opponentNickname })}
          </p>

          <ReviewFeelingSelect value={feeling} onChange={setFeeling} />
        </div>

        <div className="flex flex-col gap-7">
          <p className="text-h2-bold text-[#171717]">{t("helpQuestion")}</p>
          <ReviewHelpChecklist value={helpItems} onChange={setHelpItems} />
        </div>

        <FormProvider {...methods}>
          <InputField
            name="content"
            label={t("reviewLabel")}
            labelClassName="text-h2-bold text-[#242424]"
            wrapperClassName="gap-4"
            placeholder={t("reviewPlaceholder")}
            maxLength={300}
          />
        </FormProvider>
      </div>

      <div className="w-full border-t border-flatGray-50 bg-white px-4 pb-8 pt-3">
        <Button type="button" size="big" className="w-full" disabled={!canSubmit}>
          {t("submitLabel")}
        </Button>
      </div>
    </div>
  );
};

export default ReviewWritePage;
