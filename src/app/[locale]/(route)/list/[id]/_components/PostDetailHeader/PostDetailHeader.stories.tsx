import { Meta, StoryObj } from "@storybook/nextjs";
import PostDetailHeader from "./PostDetailHeader";

const meta: Meta<typeof PostDetailHeader> = {
  title: "페이지/상세 페이지/PostDetailHeader",
  component: PostDetailHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] border border-gray-200">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    headerData: {
      imageResponseList: [
        { id: 1, imgUrl: "https://picsum.photos/400/300?random=1", imageType: "NORMAL" },
      ],
      id: "1",
      userData: {
        userId: 1,
        nickName: "사용자 닉네임",
        profileImage: "",
        postCount: 4,
        chattingCount: 0,
      },
      isMine: false,
    },
  },
};
