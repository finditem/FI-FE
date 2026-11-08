"use client";

import { MetaDataItemWithLink, ObjectType } from "@/types/MetaDataType";

const getKakaoKey = () => {
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!key) return null;
  return key;
};

const initKakao = () => {
  const key = getKakaoKey();
  if (!key) return false;

  const Kakao = (window as any).Kakao;
  if (!Kakao) return false;

  if (!Kakao.isInitialized?.()) {
    Kakao.init(key);
  }

  return true;
};

const DEFAULT_SHARE_IMAGE =
  "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png";

const DEFAULT_WEB_VIEW_BUTTON_LABEL = "웹으로 보기";

export const shareWithKakao = (
  data: MetaDataItemWithLink,
  objectType: ObjectType,
  webViewButtonLabel: string = DEFAULT_WEB_VIEW_BUTTON_LABEL
) => {
  const Kakao = (window as any).Kakao;
  if (!Kakao) return;

  if (!Kakao.isInitialized?.()) {
    const ok = initKakao();
    if (!ok) return;
  }

  const sendDefault = Kakao.Share?.sendDefault;

  if (!sendDefault) return;

  if (objectType === "location") {
    sendDefault({
      objectType,
      address: data.address,
      addressTitle: data.title,
      content: {
        title: data.title,
        description: data.summary,
        imageUrl: data.thumbnailUrl || DEFAULT_SHARE_IMAGE,
        link: {
          mobileWebUrl: data.link,
          webUrl: data.link,
        },
      },
      social: {
        likeCount: data.likeCount,
        commentCount: data.commentCount,
        viewCount: data.viewCount,
      },
      buttons: [
        {
          title: webViewButtonLabel,
          link: {
            mobileWebUrl: data.link,
            webUrl: data.link,
          },
        },
      ],
    });
    return;
  }

  sendDefault({
    objectType,
    content: {
      title: data.title,
      description: data.summary,
      imageUrl: data.thumbnailUrl || DEFAULT_SHARE_IMAGE,
      link: {
        mobileWebUrl: data.link,
        webUrl: data.link,
      },
    },
    social: {
      likeCount: data.likeCount,
      commentCount: data.commentCount,
      viewCount: data.viewCount,
    },
    buttons: [
      {
        title: webViewButtonLabel,
        link: {
          mobileWebUrl: data.link,
          webUrl: data.link,
        },
      },
    ],
  });
};
