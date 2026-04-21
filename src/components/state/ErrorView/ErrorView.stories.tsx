import { Meta, StoryObj } from "@storybook/nextjs";
import ErrorView from "./ErrorView";

const meta: Meta<typeof ErrorView> = {
  title: "State 컴포넌트/ErrorView",
  component: ErrorView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  args: {
    iconName: "NotFound",
    code: "404",
    title: "페이지를 찾을 수 없습니다.",
    description: (
      <>
        존재하지 않는 주소를 입력했거나 <br />
        요청하신 페이지를 사용할 수 없습니다.
      </>
    ),
  },
};

export const ServerError: Story = {
  args: {
    iconName: "ServerError",
    code: "500",
    title: "서버 오류가 발생했습니다.",
    description: (
      <>
        일시적인 오류가 발생했습니다. <br />
        잠시 후 다시 시도해 주세요.
      </>
    ),
  },
};
