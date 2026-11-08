import { useParams } from "next/navigation";
import { PublicDataTabType } from "@/app/[locale]/(route)/public-data/_types/PublicDataTabType";
import { usePublicDataDetailQuery } from "../usePublicDataDetailQuery/usePublicDataDetailQuery";

export const usePublicClientDetail = (id: string) => {
  const { type } = useParams();
  const tabType = (type === "lost" ? "lost" : "found") as PublicDataTabType;
  const isLost = tabType === "lost";

  const { data, isLoading, isError } = usePublicDataDetailQuery(id, tabType);

  const itemData = Array.isArray(data) ? data[0] : data;

  if (isLoading || isError || !itemData) {
    return { isLoading, isError: isError || (!isLoading && !itemData), detailData: null };
  }

  const imageSrc =
    itemData.fdFilePathImg && !itemData.fdFilePathImg.includes("no_img.gif")
      ? itemData.fdFilePathImg
      : null;

  const title = itemData.fdPrdtNm || "";
  const content = isLost ? itemData.fdSbjt : itemData.uniq;
  const place = isLost ? itemData.depPlace : itemData.fdPlace;
  const office = itemData.depPlace || "";
  const tel = itemData.tel;

  const headerData = {
    id: itemData.atcId,
    imageResponseList: imageSrc
      ? [
          {
            id: 1,
            imgUrl: imageSrc,
            imageType: "THUMBNAIL" as const,
          },
        ]
      : [],
    userData: {
      userId: 0,
      nickName: office,
      profileImage: "",
      postCount: 0,
      chattingCount: 0,
    },
    location: office,
    phoneNumber: tel,
  };

  return {
    isLoading,
    isError,
    detailData: {
      isLost,
      headerData,
      itemData,
      title,
      content,
      place,
      office,
      tel,
      imageSrc,
    },
  };
};
