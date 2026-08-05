import type { Meta, StoryObj } from "@storybook/nextjs";
import InquiryCommentItem from "./InquiryCommentItem";
import { InquiriesCommentType } from "@/api/fetch/inquiry";

const MOCK_INQUIRY_COMMENT: InquiriesCommentType = {
  id: 1,
  content: "문의하신 내용을 확인하였습니다. 빠른 시일 내에 답변드리겠습니다.",
  authorId: 10,
  authorName: "관리자",
  authorEmail: "admin@findmyitem.com",
  profileImg: "",
  parentId: 0,
  replies: [],
  imageList: [],
  canEdit: false,
  canDelete: false,
  createdAt: "2024-03-15T10:00:00",
  admin: false,
};

const MOCK_ADMIN_COMMENT: InquiriesCommentType = {
  ...MOCK_INQUIRY_COMMENT,
  id: 2,
  content: "안녕하세요. 문의하신 사항에 대해 검토 후 답변드립니다. 불편을 드려서 죄송합니다.",
  admin: true,
};

const meta: Meta<typeof InquiryCommentItem> = {
  title: "페이지/마이페이지/1:1 문의 페이지/InquiryCommentItem",
  component: InquiryCommentItem,
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
type Story = StoryObj<typeof InquiryCommentItem>;

export const Default: Story = {
  args: {
    data: MOCK_INQUIRY_COMMENT,
  },
};

export const AdminComment: Story = {
  args: {
    data: MOCK_ADMIN_COMMENT,
  },
};

export const WithImages: Story = {
  args: {
    data: {
      ...MOCK_INQUIRY_COMMENT,
      imageList: [
        "https://picsum.photos/seed/img1/200/200",
        "https://picsum.photos/seed/img2/200/200",
      ],
    },
  },
};
