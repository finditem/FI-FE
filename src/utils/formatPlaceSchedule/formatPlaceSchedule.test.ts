import { formatPlaceSchedule } from "./formatPlaceSchedule";

const HOURS_WITH_BREAK = [
  { type: "BUSINESS" as const, startTime: "11:00:00", endTime: "21:00:00" },
  { type: "BREAK_TIME" as const, startTime: "15:00:00", endTime: "17:00:00" },
];

describe("formatPlaceSchedule", () => {
  it("팝업은 운영 상태와 무관하게 운영 기간을 표시한다", () => {
    expect(
      formatPlaceSchedule({
        type: "POPUP",
        operationStatus: "OPEN",
        operationPeriod: { startDate: "2026-07-11", endDate: "2026-07-13" },
        todayBusinessHours: null,
      })
    ).toBe("26.07.11 ~ 07.13");
  });

  it("운영중이면 조회일 영업시간을 표시한다", () => {
    expect(
      formatPlaceSchedule({
        type: "CAFE",
        operationStatus: "OPEN",
        operationPeriod: null,
        todayBusinessHours: [{ type: "BUSINESS", startTime: "07:30:00", endTime: "18:00:00" }],
      })
    ).toBe("07:30~18:00");
  });

  it("브레이크 타임이면 영업시간이 아니라 브레이크 시간을 표시한다", () => {
    expect(
      formatPlaceSchedule({
        type: "CAFE",
        operationStatus: "BREAK_TIME",
        operationPeriod: null,
        todayBusinessHours: HOURS_WITH_BREAK,
      })
    ).toBe("15:00~17:00");
  });

  it("오픈 예정이면 영업 시작 시각만 표시한다", () => {
    expect(
      formatPlaceSchedule({
        type: "CAFE",
        operationStatus: "UPCOMING",
        operationPeriod: null,
        todayBusinessHours: HOURS_WITH_BREAK,
      })
    ).toBe("11:00");
  });

  it("브레이크 타임인데 브레이크 정보가 없으면 빈 문자열을 반환한다", () => {
    expect(
      formatPlaceSchedule({
        type: "CAFE",
        operationStatus: "BREAK_TIME",
        operationPeriod: null,
        todayBusinessHours: [{ type: "BUSINESS", startTime: "09:00:00", endTime: "18:00:00" }],
      })
    ).toBe("");
  });

  it("정기 휴무일이면 빈 문자열을 반환한다", () => {
    expect(
      formatPlaceSchedule({
        type: "CAFE",
        operationStatus: "CLOSED",
        operationPeriod: null,
        todayBusinessHours: null,
      })
    ).toBe("");
  });

  it("팝업이지만 운영 기간이 없으면 영업시간으로 대체한다", () => {
    expect(
      formatPlaceSchedule({
        type: "POPUP",
        operationStatus: "OPEN",
        operationPeriod: null,
        todayBusinessHours: [{ type: "BUSINESS", startTime: "11:00:00", endTime: "20:00:00" }],
      })
    ).toBe("11:00~20:00");
  });
});
