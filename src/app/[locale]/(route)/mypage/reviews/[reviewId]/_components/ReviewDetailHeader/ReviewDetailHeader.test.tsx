import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ReviewDetailHeader from "./ReviewDetailHeader";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

const mockBack = jest.fn();

describe("ReviewDetailHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
  });

  it("제목을 렌더한다", () => {
    render(<ReviewDetailHeader title="찾길 후기" backAriaLabel="뒤로 가기" />);

    expect(screen.getByRole("heading", { name: "찾길 후기" })).toBeInTheDocument();
  });

  it("뒤로 가기 버튼에 접근성 이름을 노출한다", () => {
    render(<ReviewDetailHeader title="찾길 후기" backAriaLabel="뒤로 가기" />);

    expect(screen.getByRole("button", { name: "뒤로 가기" })).toBeInTheDocument();
  });

  it("뒤로 가기 버튼을 누르면 router.back을 호출한다", () => {
    render(<ReviewDetailHeader title="찾길 후기" backAriaLabel="뒤로 가기" />);

    fireEvent.click(screen.getByRole("button", { name: "뒤로 가기" }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
