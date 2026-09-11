import type { Meta, StoryObj } from "@storybook/nextjs";
import { MOCK_NEIGHBORHOOD_PLACES } from "../../_hooks/useNeighborhoodPlaces/neighborhoodPlaces.mock";
import NeighborhoodPlaceCard from "./NeighborhoodPlaceCard";

const meta: Meta<typeof NeighborhoodPlaceCard> = {
  title: "페이지/메인 페이지/NeighborhoodPlaceCard",
  component: NeighborhoodPlaceCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] bg-white px-5">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NeighborhoodPlaceCard>;

export const Open: Story = {
  args: { place: MOCK_NEIGHBORHOOD_PLACES[0] },
};

export const Upcoming: Story = {
  args: { place: MOCK_NEIGHBORHOOD_PLACES[1] },
};
