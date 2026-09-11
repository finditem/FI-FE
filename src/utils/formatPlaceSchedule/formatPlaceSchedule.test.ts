import { formatPlaceSchedule } from "./formatPlaceSchedule";

describe("formatPlaceSchedule", () => {
  it("팝업은 운영 기간을 YY.MM.DD ~ MM.DD로 표시한다", () => {
    expect(
      formatPlaceSchedule({
        type: "POPUP",
        operationPeriod: { startDate: "2026-07-11", endDate: "2026-07-13" },
        todayBusinessHours: null,
      })
    ).toBe("26.07.11 ~ 07.13");
  });

  it("팝업이 아니면 조회일 영업시간을 HH:mm~HH:mm으로 표시한다", () => {
    expect(
      formatPlaceSchedule({
        type: "CAFE",
        operationPeriod: null,
        todayBusinessHours: [{ type: "BUSINESS", startTime: "07:30:00", endTime: "18:00:00" }],
      })
    ).toBe("07:30~18:00");
  });

  it("영업 구간이 여러 개면 첫 시작과 마지막 종료로 묶는다", () => {
    expect(
      formatPlaceSchedule({
        type: "RESTAURANT",
        operationPeriod: null,
        todayBusinessHours: [
          { type: "BUSINESS", startTime: "09:00:00", endTime: "14:00:00" },
          { type: "BREAK_TIME", startTime: "14:00:00", endTime: "14:30:00" },
          { type: "BUSINESS", startTime: "14:30:00", endTime: "19:00:00" },
        ],
      })
    ).toBe("09:00~19:00");
  });

  it("정기 휴무일이면 빈 문자열을 반환한다", () => {
    expect(
      formatPlaceSchedule({ type: "CAFE", operationPeriod: null, todayBusinessHours: null })
    ).toBe("");
  });

  it("팝업이지만 운영 기간이 없으면 영업시간으로 대체한다", () => {
    expect(
      formatPlaceSchedule({
        type: "POPUP",
        operationPeriod: null,
        todayBusinessHours: [{ type: "BUSINESS", startTime: "11:00:00", endTime: "20:00:00" }],
      })
    ).toBe("11:00~20:00");
  });
});
