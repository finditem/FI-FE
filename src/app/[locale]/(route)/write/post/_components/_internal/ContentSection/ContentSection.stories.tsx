import { Meta, StoryObj } from "@storybook/nextjs";
import ContentSection from "./ContentSection";
import { FormProvider, useForm } from "react-hook-form";

const meta: Meta<typeof ContentSection> = {
  title: "페이지/글쓰기/ContentSection",
  component: ContentSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form className="w-[390px]">
            <Story />
          </form>
        </FormProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
