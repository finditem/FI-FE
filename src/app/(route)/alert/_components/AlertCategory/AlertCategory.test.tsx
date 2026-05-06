import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ALERT_CATEGORIES } from "../../_constants/ALERT_CATEGORIES";
import AlertCategory from "./AlertCategory";

const mockReplace = jest.fn();
const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("AlertCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockImplementation(() => null);
  });

  it("모든 알림 카테고리 필터를 렌더링한다", () => {
    render(<AlertCategory />);

    ALERT_CATEGORIES.forEach(({ label }) => {
      expect(screen.getByRole("button", { name: `${label} 필터` })).toBeInTheDocument();
    });
  });

  it("category 쿼리가 없으면 전체가 선택된다", () => {
    mockGet.mockImplementation((key: string) => (key === "category" ? null : null));
    render(<AlertCategory />);

    expect(screen.getByRole("button", { name: "전체 필터" })).toHaveClass(
      "bg-fill-neutralInversed-normal-enteredSelected"
    );
  });

  it("category 쿼리 값에 맞는 필터만 선택 스타일이 적용된다", () => {
    mockGet.mockImplementation((key: string) => (key === "category" ? "chat" : null));
    render(<AlertCategory />);

    expect(screen.getByRole("button", { name: "채팅 필터" })).toHaveClass(
      "bg-fill-neutralInversed-normal-enteredSelected"
    );
    expect(screen.getByRole("button", { name: "전체 필터" })).not.toHaveClass(
      "bg-fill-neutralInversed-normal-enteredSelected"
    );
  });

  it("필터 클릭 시 해당 category로 router.replace를 호출한다", async () => {
    const user = userEvent.setup();
    render(<AlertCategory />);

    await user.click(screen.getByRole("button", { name: "문의 필터" }));

    expect(mockReplace).toHaveBeenCalledWith("/alert?category=inquiry_reply");
  });
});
