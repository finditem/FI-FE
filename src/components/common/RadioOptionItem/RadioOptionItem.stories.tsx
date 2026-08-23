import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import RadioOptionItem from "./RadioOptionItem";
import Icon from "../Icon/Icon";
import { CATEGORY_SELECT_ICON_MAP } from "@/constants";

const meta: Meta<typeof RadioOptionItem> = {
  title: "공통 컴포넌트/RadioOptionItem",
  component: RadioOptionItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    inputName: "category",
  },
  decorators: [
    (Story) => (
      <div className="flex w-[400px] flex-col gap-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const MOCK_OPTIONS = [
  { value: "ELECTRONICS", label: "전자기기" },
  { value: "WALLET", label: "지갑" },
  { value: "ID_CARD", label: "신분증" },
  { value: "JEWELRY", label: "귀금속" },
  { value: "BAG", label: "가방" },
  { value: "CARD", label: "카드" },
  { value: "ETC", label: "기타" },
] as const;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string>(MOCK_OPTIONS[0].value);

    return (
      <>
        {MOCK_OPTIONS.map((option) => (
          <RadioOptionItem
            key={option.value}
            option={option}
            selected={selected}
            onChange={(value) => setSelected(value)}
            inputName="category"
          />
        ))}
      </>
    );
  },
};

export const WithTrailingIcon: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string>(MOCK_OPTIONS[0].value);

    return (
      <>
        {MOCK_OPTIONS.map((option) => (
          <RadioOptionItem
            key={option.value}
            option={option}
            selected={selected}
            onChange={(value) => setSelected(value)}
            inputName="category-with-icon"
            trailing={
              <Icon
                name={CATEGORY_SELECT_ICON_MAP[option.value]}
                size={24}
                className={
                  selected === option.value
                    ? "text-brand-strongUseThis-default"
                    : "text-labelsVibrant-tertiary"
                }
              />
            }
          />
        ))}
      </>
    );
  },
};
