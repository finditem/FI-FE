import type { Meta, StoryObj } from "@storybook/nextjs";
import PublicDataBeforeSearch from "./PublicDataBeforeSearch";

const meta: Meta<typeof PublicDataBeforeSearch> = {
  title: "페이지/공공데이터/검색/PublicDataBeforeSearch",
  component: PublicDataBeforeSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "공공데이터 검색 전 화면입니다. 최근 검색어가 없으면 빈 상태 UI를, 있으면 키워드 목록을 표시합니다.",
      },
    },
  },
  args: {
    removeSearch: () => {},
    onSearch: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof PublicDataBeforeSearch>;

export const Empty: Story = {
  args: {
    recentSearches: [],
  },
};

export const WithItems: Story = {
  args: {
    recentSearches: [
      { keyword: "지갑", timestamp: new Date("2024-07-20").getTime() },
      { keyword: "휴대폰", timestamp: new Date("2024-06-15").getTime() },
      { keyword: "에어팟", timestamp: new Date("2024-05-03").getTime() },
    ],
  },
};
