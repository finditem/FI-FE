import { ActivityType } from "@/types";

export type ActivityFilterValue = ActivityType | undefined;

export interface ActivityFilterState {
  startDate: string;
  endDate: string;
  activity: ActivityFilterValue;
}

export const ACTIVITY_DEFAULT_FILTERS: ActivityFilterState = {
  startDate: "",
  endDate: "",
  activity: undefined,
};
