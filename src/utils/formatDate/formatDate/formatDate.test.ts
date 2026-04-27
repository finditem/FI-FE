import formatDate from "./formatDate";

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

describe("formatDate", () => {
  const anchor = "2020-01-15T15:00:00.000Z";

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(anchor));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("같은 시각이면 지금", () => {
    expect(formatDate(anchor)).toBe("지금");
  });

  it("1분 이상~1시간 미만이면 N분 전", () => {
    const past = new Date(new Date(anchor).getTime() - 2 * MS_IN_MINUTE);
    expect(formatDate(past.toISOString())).toBe("2분 전");
  });

  it("1시간 이상~24시간 미만이면 N시간 전", () => {
    const past = new Date(new Date(anchor).getTime() - 3 * MS_IN_HOUR);
    expect(formatDate(past.toISOString())).toBe("3시간 전");
  });

  it("25시간 전이면 어제 (diffDays 1)", () => {
    const past = new Date(new Date(anchor).getTime() - 25 * MS_IN_HOUR);
    expect(formatDate(past.toISOString())).toBe("어제");
  });

  it("이틀 이상 지나면 YYYY.MM.DD", () => {
    const past = new Date(new Date(anchor).getTime() - 3 * MS_IN_DAY);
    const y = past.getFullYear();
    const m = String(past.getMonth() + 1).padStart(2, "0");
    const d = String(past.getDate()).padStart(2, "0");
    expect(formatDate(past.toISOString())).toBe(`${y}.${m}.${d}`);
  });

  it("미래 시각이면 YYYY.MM.DD (절대)", () => {
    const future = new Date(new Date(anchor).getTime() + MS_IN_DAY);
    const y = future.getFullYear();
    const m = String(future.getMonth() + 1).padStart(2, "0");
    const d = String(future.getDate()).padStart(2, "0");
    expect(formatDate(future.toISOString())).toBe(`${y}.${m}.${d}`);
  });

  it("파싱 실패 시 빈 문자열", () => {
    expect(formatDate("invalid-date")).toBe("");
  });
});
