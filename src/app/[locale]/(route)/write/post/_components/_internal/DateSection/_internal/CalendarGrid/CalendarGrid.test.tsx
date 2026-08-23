import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalendarGrid from "./CalendarGrid";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (key: string, values?: Record<string, number>) =>
      key === "dayLabel" ? `${values?.year}년 ${values?.month}월 ${values?.day}일` : key;
    t.raw = () => ["일", "월", "화", "수", "목", "금", "토"];
    return t;
  },
}));

const getDayButton = (label: string) => screen.getByRole("button", { name: label });

describe("CalendarGrid", () => {
  const onSelectDate = jest.fn();

  beforeEach(() => {
    onSelectDate.mockClear();
  });

  const renderGrid = (overrides?: Partial<Parameters<typeof CalendarGrid>[0]>) =>
    render(
      <CalendarGrid
        year={2026}
        month={7}
        selectedDate={null}
        maxDate={new Date(2026, 6, 22)}
        onSelectDate={onSelectDate}
        {...overrides}
      />
    );

  it("요일 머리글 7개를 렌더링한다", () => {
    renderGrid();

    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
  });

  it("6주 × 7일을 렌더링한다", () => {
    renderGrid();

    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
  });

  it("이번 달 날짜는 선택할 수 있다", async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.click(getDayButton("2026년 7월 10일"));

    expect(onSelectDate).toHaveBeenCalledTimes(1);
    expect(onSelectDate.mock.calls[0][0].getDate()).toBe(10);
  });

  it("maxDate 이후의 날짜는 누를 수 없다", async () => {
    const user = userEvent.setup();
    renderGrid();

    const future = getDayButton("2026년 7월 23일");
    expect(future).toBeDisabled();

    await user.click(future);
    expect(onSelectDate).not.toHaveBeenCalled();
  });

  it("앞뒤 달 날짜는 흐리게 보일 뿐 아니라 누를 수 없다", async () => {
    const user = userEvent.setup();
    renderGrid();

    // 2026-07-01은 수요일이라 첫 주에 6월 28~30일이 함께 그려진다.
    const previousMonthDay = getDayButton("2026년 6월 28일");
    expect(previousMonthDay).toBeDisabled();

    await user.click(previousMonthDay);
    expect(onSelectDate).not.toHaveBeenCalled();
  });

  it("하한 연도의 1월에서 이전 해 날짜를 눌러 하한을 넘길 수 없다", async () => {
    const user = userEvent.setup();
    renderGrid({ year: 2025, month: 1, maxDate: new Date(2026, 6, 22) });

    // 2025-01-01은 수요일이라 첫 주에 2024년 12월 29~31일이 들어온다.
    const previousYearDay = getDayButton("2024년 12월 31일");
    expect(previousYearDay).toBeDisabled();

    await user.click(previousYearDay);
    expect(onSelectDate).not.toHaveBeenCalled();
  });
});
