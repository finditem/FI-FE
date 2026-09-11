import type { Meta, StoryObj } from "@storybook/nextjs";
import type { NeighborhoodPlace } from "../../_types/NeighborhoodPlace";
import NeighborhoodPlaceCard from "./NeighborhoodPlaceCard";

const BASE_PLACE: NeighborhoodPlace = {
  placeId: 1,
  name: "젠틀 몬스터 성수 팝업",
  address: "서울 성동구 연무장13길 11",
  latitude: 37.5427,
  longitude: 127.0553,
  station: "성수역",
  stationDistanceMeters: 234,
  type: "POPUP",
  thumbnailUrl: "https://picsum.photos/200/200?random=1",
  operationStatus: "OPEN",
  operationPeriod: { startDate: "2026-07-11", endDate: "2026-07-13" },
  todayBusinessHours: null,
  isFavorite: false,
};

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

/** 운영 기간을 표시하는 팝업 */
export const Open: Story = {
  args: { place: BASE_PLACE },
};

/** 오늘 영업시간을 표시하는 카페 */
export const Cafe: Story = {
  args: {
    place: {
      ...BASE_PLACE,
      placeId: 2,
      name: "성수 로스터리",
      type: "CAFE",
      operationPeriod: null,
      todayBusinessHours: [{ type: "BUSINESS", startTime: "07:30:00", endTime: "18:00:00" }],
    },
  },
};

/** 브레이크 타임 — 영업시간이 아니라 브레이크 시간을 보여준다 */
export const BreakTime: Story = {
  args: {
    place: {
      ...BASE_PLACE,
      placeId: 3,
      name: "대림창고",
      type: "CAFE",
      operationStatus: "BREAK_TIME",
      operationPeriod: null,
      todayBusinessHours: [
        { type: "BUSINESS", startTime: "11:00:00", endTime: "21:00:00" },
        { type: "BREAK_TIME", startTime: "15:00:00", endTime: "17:00:00" },
      ],
    },
  },
};

/** 오픈 예정 — 시작 시각만 "11:00 오픈" 형태로 보여준다 */
export const Upcoming: Story = {
  args: {
    place: {
      ...BASE_PLACE,
      placeId: 4,
      name: "텅플래닛",
      type: "CAFE",
      operationStatus: "UPCOMING",
      operationPeriod: null,
      todayBusinessHours: [{ type: "BUSINESS", startTime: "11:00:00", endTime: "20:00:00" }],
    },
  },
};

/** 영업 종료 */
export const Closed: Story = {
  args: { place: { ...BASE_PLACE, placeId: 5, operationStatus: "CLOSED" } },
};
