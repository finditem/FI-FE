import type { Meta, StoryObj } from "@storybook/nextjs";
import ReportCommentItem from "./ReportCommentItem";
import { ReportByIdType } from "@/api/fetch/report";

const MOCK_REPORT_DATA: ReportByIdType = {
  nickname: "홍길동",
  reportId: 1,
  targetId: 100,
  reportType: "POST",
  targetType: "POST",
  targetTitle: "잃어버린 러닝화를 찾습니다",
  reason: "허위 정보가 포함된 게시글입니다.",
  status: "PENDING",
  answered: false,
  adminAnswer: "",
  adminNickname: "",
  adminProfileImg: "",
  answerImageList: [],
  resolvedAt: "",
  createdAt: "2024-03-10T09:00:00",
};

const MOCK_REPORT_WITH_ANSWER: ReportByIdType = {
  ...MOCK_REPORT_DATA,
  answered: true,
  status: "RESOLVED",
  adminAnswer:
    "신고 내용을 검토하여 해당 게시글에 대한 조치를 완료하였습니다. 이용해 주셔서 감사합니다.",
  adminNickname: "관리자",
  adminProfileImg: "",
  resolvedAt: "2024-03-12T14:00:00",
};

const meta: Meta<typeof ReportCommentItem> = {
  title: "페이지/마이페이지/신고 내역 페이지/ReportCommentItem",
  component: ReportCommentItem,
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
type Story = StoryObj<typeof ReportCommentItem>;

export const WithAdminAnswer: Story = {
  args: {
    data: MOCK_REPORT_WITH_ANSWER,
  },
};

export const WithAnswerImages: Story = {
  args: {
    data: {
      ...MOCK_REPORT_WITH_ANSWER,
      answerImageList: [
        "https://picsum.photos/seed/report1/200/200",
        "https://picsum.photos/seed/report2/200/200",
      ],
    },
  },
};
