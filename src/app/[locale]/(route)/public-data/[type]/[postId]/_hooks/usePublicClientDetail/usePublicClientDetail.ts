import { useParams } from "next/navigation";
import { PublicDataTabType } from "@/app/[locale]/(route)/public-data/_types/PublicDataTabType";
import type { PublicDataItem } from "@/types";
import { usePublicDataDetailQuery } from "../usePublicDataDetailQuery/usePublicDataDetailQuery";

/**
 * 경찰청 유실물 상세 화면에 필요한 값을 조회 결과에서 가공해 돌려줍니다.
 *
 * @remarks
 * - `initialItem`(서버 조회 결과)이 있으면 클라이언트 조회를 기다리지 않고 그 값으로 바로 가공합니다.
 *   클라이언트 조회 결과가 오면 그 값을 우선합니다.
 *
 * @param id - 포털 관리번호
 * @param initialItem - 서버에서 미리 조회한 항목
 *
 * @author suhyeon
 */
export const usePublicClientDetail = (id: string, initialItem?: PublicDataItem) => {
  const { type } = useParams();
  const tabType = (type === "lost" ? "lost" : "found") as PublicDataTabType;
  const isLost = tabType === "lost";

  const { data, isLoading, isError } = usePublicDataDetailQuery(id, tabType);

  // 서버 데이터는 캐시에 넣지 않고 인자로만 받는다. 클라이언트 조회 결과가 있으면 그것을 우선한다.
  const itemData = (Array.isArray(data) ? data[0] : data) ?? initialItem;

  if (!itemData) {
    return { isLoading, isError: isError || !isLoading, detailData: null };
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
    isLoading: false,
    isError: false,
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
