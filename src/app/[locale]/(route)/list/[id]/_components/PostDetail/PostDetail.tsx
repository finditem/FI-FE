import { useEffect } from "react";
import type { PostDetailData } from "@/api/fetch/post/types/PostDetailType";
import PostDetailHeader from "../PostDetailHeader/PostDetailHeader";
import { PostDetailBody, PostDetailPreviewNaverMap } from "../_internal";
import { trackViewItemDetail, toItemTypeLabel } from "@/utils/analytics/analytics";

interface PostDetailProps {
  data: PostDetailData;
}

const PostDetail = ({ data }: PostDetailProps) => {
  useEffect(() => {
    trackViewItemDetail(toItemTypeLabel(data.postType));
  }, [data.id, data.postType]);

  const headerData = {
    id: String(data.id),
    userData: data.postUserInformation,
    isMine: data.isMine,
    imageResponseList: data.imageResponseList,
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
        <PostDetailBody data={data} />

        <PostDetailPreviewNaverMap data={mapData} />
      </section>
    </article>
  );
};

export default PostDetail;
