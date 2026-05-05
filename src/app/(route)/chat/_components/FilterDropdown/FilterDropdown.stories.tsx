import { Meta, StoryObj } from "@storybook/nextjs";
import FilterDropdown from "./FilterDropdown";
import { SORT_OPTIONS, TYPE_OPTIONS } from "../../constants/FILTER";

const meta: Meta<typeof FilterDropdown> = {
  title: "페이지/채팅 목록 페이지/FilterDropdown",
  component: FilterDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "채팅 목록에서 정렬(sort) 또는 타입(type) 필터를 선택할 수 있는 드롭다운 컴포넌트입니다. URL 쿼리 파라미터와 연동되어 선택된 값을 표시합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[200px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FilterDropdown>;

const mockSearchUpdateQuery = (key: string, value?: string) => {
  console.log(`searchUpdateQuery called with key: ${key}, value: ${value}`);
};

export const SortFilter: Story = {
  args: {
    ariaLabel: "채팅 리스트 최신순",
    options: SORT_OPTIONS,
    keyName: "sort",
    searchUpdateQuery: mockSearchUpdateQuery,
  },
  parameters: {
    docs: {
      description: {
        story: "정렬 필터 드롭다운입니다. 기본값으로 '최신순'이 표시됩니다.",
      },
    },
  },
};

export const TypeFilter: Story = {
  args: {
    ariaLabel: "채팅 리스트 분실/발견",
    options: TYPE_OPTIONS,
    keyName: "type",
    searchUpdateQuery: mockSearchUpdateQuery,
  },
  parameters: {
    docs: {
      description: {
        story: "타입 필터 드롭다운입니다. 기본값으로 '분실/발견'이 표시됩니다.",
      },
    },
  },
};
