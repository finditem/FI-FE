import { useEffect } from "react";
import type { PostDetailData } from "@/api/fetch/post/types/PostDetailType";
import PostDetailHeader from "../PostDetailHeader/PostDetailHeader";
import { PostDetailBody, PostDetailPreviewNaverMap } from "../_internal";
import { trackViewItemDetail, toItemTypeLabel } from "@/utils/analytics/analytics";

interface PostDetailProps {
  data: PostDetailData;
  /**
   * 사용자별 값(`isMine`, `favoriteStatus`)이 반영된 데이터인지 여부입니다. (default: true)
   * 로그인 사용자가 서버의 익명 데이터만 가진 동안 `false`로 넘기면 채팅·즐겨찾기 버튼을 비활성화해
   * 익명 기준 값으로 잘못된 요청이 나가지 않게 합니다.
   */
  isPersonalized?: boolean;
}

const PostDetail = ({ data, isPersonalized = true }: PostDetailProps) => {
  useEffect(() => {
    trackViewItemDetail(toItemTypeLabel(data.postType));
  }, [data.id, data.postType]);

  const headerData = {
    id: String(data.id),
    userData: data.postUserInformation,
    isMine: data.isMine,
    imageResponseList: data.imageResponseList,
    isPersonalized,
  };

  const mapData = {
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    postId: String(data.id),
    radius: data.radius,
    date: data.date,
    postType: data.postType,
  };

  return (
    <article className="w-full">
      <PostDetailHeader headerData={headerData} />

      <section className="flex flex-col gap-9 px-5 py-[27px]">
        <PostDetailBody data={data} isPersonalized={isPersonalized} />

        <PostDetailPreviewNaverMap data={mapData} />
      </section>
    </article>
  );
};

export default PostDetail;
