import { act, fireEvent, render, screen } from "@testing-library/react";
import ScrollToTopButton from "./ScrollToTopButton";

describe("ScrollToTopButton", () => {
  const scrollTo = jest.fn();

  beforeEach(() => {
    scrollTo.mockClear();
    window.scrollTo = scrollTo;
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
  });

  it("onHide가 true이면 렌더하지 않습니다", () => {
    const { container } = render(<ScrollToTopButton onHide />);
    expect(container.firstChild).toBeNull();
  });

  it("초기에는 상단 근처로 간주되어 렌더하지 않습니다", () => {
    const { container } = render(<ScrollToTopButton />);
    expect(container.firstChild).toBeNull();
  });

  it("스크롤이 임계값을 넘으면 버튼이 보이고 클릭 시 scrollTo가 호출됩니다", () => {
    render(<ScrollToTopButton />);
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 250 });
    act(() => {
      fireEvent.scroll(window);
    });
    const btn = screen.getByRole("button", { name: "스크롤 맨 위로 이동" });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
