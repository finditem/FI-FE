import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ReviewCardData } from "../../../_types/ReviewCardData";
import ReviewCard from "./ReviewCard";

const MOCK_REVIEW: ReviewCardData = {
  id: 1,
  nickname: "우주강아지",
  location: "성동구 성수1동",
  createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  content:
    "카페에 파란색 지갑을 두고 나와서 온종일 발만 동동 굴렀는데, 분실 등록하자마자 바로 연락 주셔서 무사히 돌려받았어요. 정말 감사합니다!",
  tagLabel: "친절하고 따뜻하게 대해주셨어요.",
  extraTagCount: 1,
};

const meta: Meta<typeof ReviewCard> = {
  title: "페이지/마이페이지/찾길 후기 페이지/ReviewCard",
  component: ReviewCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ul className="w-[390px] border border-gray-200">
        <Story />
      </ul>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReviewCard>;

export const Default: Story = {
  args: { data: MOCK_REVIEW },
};

export const WithoutExtraTag: Story = {
  args: { data: { ...MOCK_REVIEW, extraTagCount: undefined } },
};

export const LongContent: Story = {
  args: {
    data: {
      ...MOCK_REVIEW,
      content:
        "늦은 밤에 연락드렸는데 흔쾌히 나와주셔서 정말 감사했어요. 덕분에 신분증을 다시 만들지 않아도 되어 한시름 놓았습니다. 성수동에 이렇게 따뜻한 이웃이 계셔서 다행이에요. 본문이 두 줄을 넘으면 말줄임 처리됩니다.",
    },
  },
};
