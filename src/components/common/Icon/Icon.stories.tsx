import type { Meta, StoryObj } from "@storybook/nextjs";
import Icon from "./Icon";
import { iconImports, iconManifest } from "./index";
import type { IconName } from "./index";

const iconOptions = [...Object.keys(iconManifest), ...Object.keys(iconImports)] as Array<IconName>;

const meta: Meta<typeof Icon> = {
  title: "아이콘/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: iconOptions,
    },
    size: { control: { type: "number" } },
    className: { control: "text" },
    title: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {iconOptions.map((iconName) => (
        <div
          key={iconName}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <Icon name={iconName} size={24} />
          <span style={{ fontSize: "12px" }}>{iconName}</span>
        </div>
      ))}
    </div>
  ),
};
