import { FourthSection, HeroSection, SecondSection, ThirdSection } from "./ImageSlots";

export const FEATURES = [
  {
    content: {
      title: "분실물 찾기, 더 쉽고 빠르게",
      description: (
        <>
          물건을 잃어버렸을 때, 어떻게 찾아야 할지 막막할때가 있죠. '찾아줘!'는 그런 순간에
          <br className="hidden tablet:block" />
          함께하는 실시간 위치 기반 분실물 찾기 플랫폼입니다.
        </>
      ),
    },
    imageSlot: <HeroSection />,
  },
  {
    content: {
      title: "지역, 카테고리별 분실물 제보 확인",
      description:
        "분실 지역, 물건 카테고리 별로 분실물 제보를 확인하고 편리하게 유실물을 찾아보세요.",
    },
    variant: "highlight",
    imageSlot: <SecondSection />,
  },
  {
    content: {
      title: "제보자와 실시간 채팅",
      description:
        "실시간 채팅으로 제보자와 바로 대화하며 잃어버린 물건을 더 빠르고 쉽게 되찾을 수 있어요.",
    },
    imageSlot: <ThirdSection />,
  },
  {
    content: {
      title: "카테고리 알림으로 신규 게시글 확인",
      description:
        "알림을 받고 싶은 분실물 카테고리 키워드를 등록하면, 해당 게시글이 등록됐을 때 알림을 전송해요.",
    },
    variant: "highlight",
    imageSlot: <FourthSection />,
  },
] as const;
