import { formatKoreanDate, formatChatTime } from "@/utils";

const formatDateWithTime = (isoString: string, weekdays?: string[]): string => {
  const datePart = formatKoreanDate(isoString, weekdays).replace(" ", ". ");
  const timePart = formatChatTime(isoString);
  return `${datePart} ${timePart}`;
};

export default formatDateWithTime;
