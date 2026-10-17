import type { Meta, StoryObj } from "@storybook/nextjs";
import { MOCK_REVIEW_CARD } from "@/mock/data";
import ReviewCard from "./ReviewCard";

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
  args: { data: MOCK_REVIEW_CARD },
};

export const WithoutExtraTag: Story = {
  args: { data: { ...MOCK_REVIEW_CARD, extraTagCount: undefined } },
};

export const LongContent: Story = {
  args: {
    data: {
      ...MOCK_REVIEW_CARD,
      content:
        "늦은 밤에 연락드렸는데 흔쾌히 나와주셔서 정말 감사했어요. 덕분에 신분증을 다시 만들지 않아도 되어 한시름 놓았습니다. 성수동에 이렇게 따뜻한 이웃이 계셔서 다행이에요. 본문이 두 줄을 넘으면 말줄임 처리됩니다.",
    },
  },
};
