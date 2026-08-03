import { InquiryFilterStatus } from "@/types";

export type InquiryStatusFilterValue = InquiryFilterStatus | undefined;

export interface InquiryStatusFilterState {
  inquiryStatus: InquiryStatusFilterValue;
}
