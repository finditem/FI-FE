import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";

/**
 * 댓글 Empty UI
 *
 * @remarks
 * 비회원에게는 로그인이 선행되어야 함을 문구에 드러냅니다.
 * 작성을 권한 뒤 로그인 모달로 막는 흐름을 만들지 않기 위함입니다.
 *
 * @author jikwon
 */

interface EmptyCommentUIProps {
  /** 비회원 여부 */
  isGuest?: boolean;
}

/**
 * @example
 * ```tsx
 * <EmptyCommentUI isGuest={true} />
 * ```
 */

const EmptyCommentUI = ({ isGuest = false }: EmptyCommentUIProps) => {
  const t = useTranslations("EmptyCommentUI");
  const guide = t(isGuest ? "guideGuest" : "guideMember");

  return (
    <div className="gap-5 py-8 text-center flex-col-center">
      <Icon name="NoComments" size={70} />
      <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
        {t("message", { guide })}
      </p>
    </div>
  );
};

export default EmptyCommentUI;
