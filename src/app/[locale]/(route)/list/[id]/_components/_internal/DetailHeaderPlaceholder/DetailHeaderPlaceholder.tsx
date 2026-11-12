import { useTranslations } from "next-intl";
import { DetailHeader, HeaderMenu, HeaderShare, HeaderStar } from "@/components";

/**
 * 게시글 상세 상단 헤더의 자리표시입니다. 즐겨찾기·공유·메뉴 버튼을 비활성 상태로 보여줍니다.
 *
 * @remarks
 * - 본문은 서버 데이터로 먼저 그리지만, 상단 헤더의 즐겨찾기 상태와 메뉴 항목(수정·삭제 또는 신고·차단)은
 *   사용자별 값이라 클라이언트 조회가 끝나야 확정됩니다. 그 전까지 이 자리표시를 두어 레이아웃을 유지하고,
 *   익명 값으로 잘못된 동작이 실행되지 않게 합니다.
 * - 조회가 끝나면 `PostDetailTopHeader`로 교체합니다. 감싸는 sticky 영역은 그 컴포넌트와 같게 맞췄습니다.
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * {livePost ? <PostDetailTopHeader postId={id} postData={postData} /> : <DetailHeaderPlaceholder />}
 * ```
 */
const DetailHeaderPlaceholder = () => {
  const t = useTranslations("PostDetailTopHeader");

  return (
    <div className="sticky right-0 top-0 z-10 mx-auto">
      <DetailHeader>
        <HeaderStar isActive={false} disabled ariaLabel={t("favoriteAriaLabel")} />
        <HeaderShare disabled ariaLabel={t("shareAriaLabel")} />
        <HeaderMenu disabled ariaLabel={t("menuAriaLabel")} />
      </DetailHeader>
    </div>
  );
};

export default DetailHeaderPlaceholder;
