import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateSection from "./DateSection";

const setValueMock = jest.fn();
let watchedDate = "";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    control: {},
    setValue: setValueMock,
  }),
  useWatch: () => watchedDate,
}));

jest.mock("@/components", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
  RequiredText: () => <span data-testid="required-text">*</span>,
}));

jest.mock("./_internal/DatePickerModal/DatePickerModal", () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="date-picker-modal">
        <button onClick={onClose}>닫기</button>
      </div>
    ) : null,
}));

const todayYmd = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
};

describe("DateSection", () => {
  beforeEach(() => {
    watchedDate = "";
    setValueMock.mockClear();
  });

  it("값이 없으면 오늘 날짜를 플레이스홀더로 보여준다", () => {
    const { container } = render(<DateSection />);

    expect(screen.getByText(todayYmd())).toBeInTheDocument();
    // 고른 값이 아니라 안내이므로 time으로 마크업하지 않는다.
    expect(container.querySelector("time")).toBeNull();
    expect(screen.getByTestId("required-text")).toBeInTheDocument();
  });

  it("달력 아이콘이 텍스트 뒤 오른쪽 끝에 온다", () => {
    render(<DateSection />);

    const button = screen.getByRole("button");
    expect(button.lastElementChild).toBe(screen.getByTestId("icon-WriteCalendar"));
    expect(button).toHaveClass("justify-between");
  });

  it("폼에 값이 있으면 time 태그로 날짜를 보여준다", () => {
    watchedDate = "2026-07-22";
    const { container } = render(<DateSection />);

    const time = container.querySelector("time");
    expect(time).toHaveAttribute("dateTime", "2026-07-22");
    expect(time).toHaveTextContent("2026-07-22");
  });

  it("ISO 문자열로 저장된 값도 읽는다", () => {
    watchedDate = new Date(2026, 6, 22, 9, 30).toISOString();
    const { container } = render(<DateSection />);

    expect(container.querySelector("time")).toHaveTextContent("2026-07-22");
  });

  it("버튼은 form submit을 일으키지 않는 type이다", () => {
    render(<DateSection />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("버튼을 누르면 날짜 선택 모달이 열린다", async () => {
    const user = userEvent.setup();
    render(<DateSection />);

    expect(screen.queryByTestId("date-picker-modal")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("date-picker-modal")).toBeInTheDocument();
  });
});
