import { Meta, StoryObj } from "@storybook/nextjs";
import LanguageDropdown from "./LanguageDropdown";

const meta: Meta<typeof LanguageDropdown> = {
  title: "페이지/로그인 페이지/LanguageDropdown",
  component: LanguageDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "로그인 페이지에서 언어를 선택할 수 있는 드롭다운 컴포넌트입니다. 선택 시 해당 로케일로 라우팅됩니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[116px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageDropdown>;

export const Default: Story = {};
