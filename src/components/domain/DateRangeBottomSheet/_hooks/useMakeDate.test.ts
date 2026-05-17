import { renderHook, act } from "@testing-library/react";
import useMakeDate from "./useMakeDate";

describe("useMakeDate", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-05-07"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("초기값", () => {
    it("queryDate 없이 초기화 시 selectDate가 오늘 날짜(2025-05-07)로 설정된다", () => {
      const { result } = renderHook(() => useMakeDate());
      expect(result.current.selectDate).toEqual({ year: 2025, month: 5, day: 7 });
    });

    it("queryDate가 전달되면 해당 날짜로 초기화된다", () => {
      const queryDate = { year: 2025, month: 3, day: 15 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      expect(result.current.selectDate).toEqual(queryDate);
    });
  });

  describe("years", () => {
    it("years 배열이 2025부터 현재 연도(2025)까지 포함된다", () => {
      const { result } = renderHook(() => useMakeDate());
      expect(result.current.years).toEqual([2025]);
    });
  });

  describe("months", () => {
    it("현재 연도(2025)이면 months가 현재 월(5월)까지만 포함된다", () => {
      const { result } = renderHook(() => useMakeDate());
      expect(result.current.months).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("days", () => {
    it("현재 연도+현재 월이면 days가 현재 일(7)까지만 포함된다", () => {
      const { result } = renderHook(() => useMakeDate());
      expect(result.current.days).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("현재 월이 아닌 달이면 days가 해당 월의 최대 일수까지 포함된다 (1월=31일)", () => {
      const queryDate = { year: 2025, month: 1, day: 5 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      expect(result.current.days).toHaveLength(31);
      expect(result.current.days[30]).toBe(31);
    });

    it("2월이면 days가 28일까지 포함된다 (2025년 윤년 아님)", () => {
      const queryDate = { year: 2025, month: 2, day: 1 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      expect(result.current.days).toHaveLength(28);
    });
  });

  describe("handleDateChange", () => {
    it("month를 변경하면 selectDate.month가 업데이트된다", () => {
      const { result } = renderHook(() => useMakeDate());
      act(() => {
        result.current.handleDateChange("month", 3);
      });
      expect(result.current.selectDate.month).toBe(3);
    });

    it("day를 변경하면 selectDate.day가 업데이트된다", () => {
      const queryDate = { year: 2025, month: 1, day: 1 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      act(() => {
        result.current.handleDateChange("day", 20);
      });
      expect(result.current.selectDate.day).toBe(20);
    });

    it("month 변경 시 day가 해당 월 최대 일수를 초과하면 최대값으로 보정된다 (1월 31일 -> 2월 28일)", () => {
      const queryDate = { year: 2025, month: 1, day: 31 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      act(() => {
        result.current.handleDateChange("month", 2);
      });
      expect(result.current.selectDate.month).toBe(2);
      expect(result.current.selectDate.day).toBe(28);
    });

    it("month 변경 시 day가 해당 월 최대 일수 이내이면 보정되지 않는다", () => {
      const queryDate = { year: 2025, month: 1, day: 15 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      act(() => {
        result.current.handleDateChange("month", 2);
      });
      expect(result.current.selectDate.day).toBe(15);
    });
  });

  describe("handleResetDate", () => {
    it("오늘 날짜(2025-05-07)로 초기화된다", () => {
      const queryDate = { year: 2025, month: 1, day: 5 };
      const { result } = renderHook(() => useMakeDate(queryDate));
      act(() => {
        result.current.handleResetDate();
      });
      expect(result.current.selectDate).toEqual({ year: 2025, month: 5, day: 7 });
    });
  });
});
