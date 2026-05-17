import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateRangeBottomSheet from "./DateRangeBottomSheet";
import { parseYmd } from "@/utils";

const mockRouterReplace = jest.fn();
const mockAddToast = jest.fn();
const mockApplyFiltersToUrl = jest.fn(() => "");
const mockUseMakeDate = jest.fn();

jest.mock("swiper", () => ({}));
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: any) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("swiper/modules", () => ({ Mousewheel: {} }));

jest.mock("./_hooks/useMakeDate", () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseMakeDate(...args),
}));

let mockFilterParams: { startDate: string | undefined; endDate: string | undefined } = {
  startDate: undefined,
  endDate: undefined,
};

jest.mock("@/hooks/domain", () => ({
  useFilterParams: () => mockFilterParams,
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ toString: () => "" }),
  useRouter: () => ({ replace: mockRouterReplace }),
  usePathname: () => "/",
}));

jest.mock("../PopupLayout/PopupLayout", () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, onClick, ariaLabel }: any) => (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  Filter: ({ children, onClick, ariaLabel }: any) => (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

jest.mock("../../../utils/applyFiltersToUrl/applyFiltersToUrl", () => ({
  applyFiltersToUrl: (...args: any[]) => mockApplyFiltersToUrl.apply(null, args),
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
  parseYmd: jest.fn(() => null),
}));

const baseUseMakeDateReturn = {
  years: [2025],
  months: [1, 2, 3, 4, 5],
  days: [1, 2, 3, 4, 5, 6, 7],
  selectDate: { year: 2025, month: 5, day: 7 },
  handleDateChange: jest.fn(),
  handleResetDate: jest.fn(),
};

const defaultFilters = { startDate: "", endDate: "" };

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  filters: defaultFilters,
  setFilters: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseMakeDate.mockReturnValue(baseUseMakeDateReturn);
  mockFilterParams = { startDate: undefined, endDate: undefined };
});

describe("<DateRangeBottomSheet />", () => {
  describe("기본 렌더링", () => {
    it("'기간 설정' 제목이 렌더된다", () => {
      render(<DateRangeBottomSheet {...defaultProps} />);
      expect(screen.getByText("기간 설정")).toBeInTheDocument();
    });

    it("'시작일'과 '종료일' 탭 버튼이 렌더된다", () => {
      render(<DateRangeBottomSheet {...defaultProps} />);
      expect(screen.getByRole("button", { name: "시작일" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "종료일" })).toBeInTheDocument();
    });

    it("'초기화'와 '적용하기' 버튼이 렌더된다", () => {
      render(<DateRangeBottomSheet {...defaultProps} />);
      expect(screen.getByText("초기화")).toBeInTheDocument();
      expect(screen.getByText("적용하기")).toBeInTheDocument();
    });

    it("isOpen=false이면 렌더되지 않는다", () => {
      render(<DateRangeBottomSheet {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("기간 설정")).not.toBeInTheDocument();
    });
  });

  describe("초기화 버튼", () => {
    it("클릭 시 setFilters가 startDate/endDate를 undefined로 호출된다", () => {
      const setFilters = jest.fn();
      render(<DateRangeBottomSheet {...defaultProps} setFilters={setFilters} />);
      fireEvent.click(screen.getByRole("button", { name: "날짜 초기화 버튼" }));
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ startDate: undefined, endDate: undefined })
      );
    });

    it("클릭 시 onClose가 호출된다", () => {
      const onClose = jest.fn();
      render(<DateRangeBottomSheet {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByRole("button", { name: "날짜 초기화 버튼" }));
      expect(onClose).toHaveBeenCalled();
    });

    it("클릭 시 router.replace가 호출된다", () => {
      render(<DateRangeBottomSheet {...defaultProps} />);
      fireEvent.click(screen.getByRole("button", { name: "날짜 초기화 버튼" }));
      expect(mockRouterReplace).toHaveBeenCalled();
    });
  });

  describe("적용하기 버튼", () => {
    it("start <= end이면 setFilters, onClose, router.replace가 모두 호출된다", () => {
      // start: 2025-05-01, end: 2025-05-07 (유효)
      mockUseMakeDate
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 1 },
        })
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 7 },
        });

      const setFilters = jest.fn();
      const onClose = jest.fn();
      render(<DateRangeBottomSheet {...defaultProps} setFilters={setFilters} onClose={onClose} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(setFilters).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
      expect(mockRouterReplace).toHaveBeenCalled();
    });

    it("start > end이면 toast 경고가 표시된다", () => {
      // start: 2025-05-07, end: 2025-05-01 (무효)
      mockUseMakeDate
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 7 },
        })
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 1 },
        });

      render(<DateRangeBottomSheet {...defaultProps} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(mockAddToast).toHaveBeenCalledWith("종료일은 시작일보다 이전일 수 없어요", "warning");
    });

    it("start > end이면 setFilters와 onClose가 호출되지 않는다", () => {
      mockUseMakeDate
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 7 },
        })
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 1 },
        });

      const setFilters = jest.fn();
      const onClose = jest.fn();
      render(<DateRangeBottomSheet {...defaultProps} setFilters={setFilters} onClose={onClose} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(setFilters).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });

    it("적용하기 클릭 시 포맷된 날짜를 setFilters에 전달한다", () => {
      mockUseMakeDate
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 1 },
        })
        .mockReturnValueOnce({
          ...baseUseMakeDateReturn,
          selectDate: { year: 2025, month: 5, day: 7 },
        });

      const setFilters = jest.fn();
      render(<DateRangeBottomSheet {...defaultProps} setFilters={setFilters} />);
      fireEvent.click(screen.getByText("적용하기"));
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ startDate: "2025-05-01", endDate: "2025-05-07" })
      );
    });
  });

  describe("URL 쿼리 파라미터 초기값", () => {
    it("URL에 startDate와 endDate가 있으면 parseYmd로 파싱한 값을 useMakeDate 초기값으로 전달한다", () => {
      const parsedStart = { year: 2025, month: 3, day: 1 };
      const parsedEnd = { year: 2025, month: 3, day: 15 };

      mockFilterParams = { startDate: "2025-03-01", endDate: "2025-03-15" };
      (parseYmd as jest.Mock).mockReturnValueOnce(parsedStart).mockReturnValueOnce(parsedEnd);

      render(<DateRangeBottomSheet {...defaultProps} />);

      expect(parseYmd).toHaveBeenCalledWith("2025-03-01");
      expect(parseYmd).toHaveBeenCalledWith("2025-03-15");
      expect(mockUseMakeDate).toHaveBeenCalledWith(parsedStart);
      expect(mockUseMakeDate).toHaveBeenCalledWith(parsedEnd);
    });
  });
});
