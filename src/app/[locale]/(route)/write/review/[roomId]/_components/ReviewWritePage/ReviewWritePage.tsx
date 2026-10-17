"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { DetailHeader } from "@/components/layout";
import { Button, InputField, RequiredText } from "@/components/common";
import useGetChatRoom from "@/api/fetch/chatRoom/api/useGetChatRoom";
import { useGetUsersMe } from "@/api/fetch/user";
import { usePostReview, type ReviewEmotionType, type ReviewHelpType } from "@/api/fetch/review";
import ReviewFeelingSelect from "./_internal/ReviewFeelingSelect/ReviewFeelingSelect";
import ReviewHelpChecklist from "./_internal/ReviewHelpChecklist/ReviewHelpChecklist";
import ReviewCompleteModal from "./_internal/ReviewCompleteModal/ReviewCompleteModal";
import type { ReviewFeelingValue } from "../../_types/ReviewFeelingValue";
import type { ReviewHelpItemValue } from "../../_types/ReviewHelpItemValue";

interface ReviewFormValues {
  content: string;
}

interface ReviewWritePageProps {
  roomId: number;
}

// 프론트 전용 UI 값(ReviewFeelingValue/ReviewHelpItemValue)을 백엔드 계약 enum으로 변환한다.
const EMOTION_REQUEST_MAP: Record<ReviewFeelingValue, ReviewEmotionType> = {
  touched: "MOVED",
  grateful: "GRATEFUL",
  heartFlutter: "HEART_FLUTTERED",
};

const HELP_TYPE_REQUEST_MAP: Record<ReviewHelpItemValue, ReviewHelpType> = {
  kind: "KIND_AND_WARM",
  trustworthy: "TRUSTWORTHY_COMMUNICATION",
  quickResponse: "QUICK_RESPONSE",
  safeKeeping: "SAFE_STORAGE",
  helpfulInfo: "USEFUL_INFORMATION",
};

/**
 * 찾길 후기 작성 페이지입니다. 채팅 상세의 "분실물 찾기 완료" 확인 모달에서 "후기 남기기"를 눌렀을 때
 * 진입합니다.
 *
 * @author suhyeon
 */

const ReviewWritePage = ({ roomId }: ReviewWritePageProps) => {
  const t = useTranslations("ReviewWritePage");
  const router = useRouter();
  const { data: chatRoom } = useGetChatRoom({ roomId });
  const { data: userInfo } = useGetUsersMe();
  const [feeling, setFeeling] = useState<ReviewFeelingValue | null>(null);
  const [helpItems, setHelpItems] = useState<ReviewHelpItemValue[]>([]);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const methods = useForm<ReviewFormValues>({
    mode: "onChange",
    defaultValues: { content: "" },
  });
  const { mutate: postReview, isPending } = usePostReview(roomId, {
    onSuccess: () => setIsCompleteOpen(true),
  });

  const myNickname = userInfo?.result?.nickname ?? "";
  const opponentNickname = chatRoom?.result.opponentUser.nickname ?? "";
  const findCompletionId = chatRoom?.result.findCompletion?.findCompletionId ?? null;
  // 감정 유형(1개)과 도움 경험(1개 이상)은 필수, 상세 후기는 선택 입력이다.
  const canSubmit = feeling !== null && helpItems.length > 0 && findCompletionId !== null;

  const handleSubmit = () => {
    if (feeling === null || findCompletionId === null) return;

    postReview({
      findCompletionId,
      emotion: EMOTION_REQUEST_MAP[feeling],
      helpTypes: helpItems.map((item) => HELP_TYPE_REQUEST_MAP[item]),
      content: methods.getValues("content"),
    });
  };

  const handleCompleteConfirm = () => {
    setIsCompleteOpen(false);
    router.back();
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <DetailHeader title={t("title")} />

      <div className="flex flex-1 flex-col gap-10 px-5 py-6">
        <div className="flex flex-col gap-7">
          <p className="whitespace-pre-line text-h2-bold text-labelsVibrant-primary">
            {t("greeting", { myNickname, opponentNickname })}{" "}
            <RequiredText className="text-system-success" />
          </p>

          <ReviewFeelingSelect value={feeling} onChange={setFeeling} />
        </div>

        <div className="flex flex-col gap-7">
          <p className="text-h2-bold text-labelsVibrant-primary">
            {t("helpQuestion")} <RequiredText className="text-system-success" />
          </p>
          <ReviewHelpChecklist value={helpItems} onChange={setHelpItems} />
        </div>

        <FormProvider {...methods}>
          <InputField
            name="content"
            label={
              <>
                {t("reviewLabel")} <span className="text-h2-regular">{t("reviewOptional")}</span>
              </>
            }
            labelClassName="text-h2-bold text-labelsVibrant-primary"
            wrapperClassName="gap-4"
            placeholder={t("reviewPlaceholder")}
            maxLength={300}
          />
        </FormProvider>
      </div>

      <div className="w-full border-t border-flatGray-50 bg-white px-4 pb-8 pt-3">
        <Button
          type="button"
          size="big"
          className="w-full"
          disabled={!canSubmit || isPending}
          onClick={handleSubmit}
        >
          {t("submitLabel")}
        </Button>
      </div>

      <ReviewCompleteModal isOpen={isCompleteOpen} onConfirm={handleCompleteConfirm} />
    </div>
  );
};

export default ReviewWritePage;
