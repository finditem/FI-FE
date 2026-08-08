import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatChip from "./ChatChip";

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("ChatChip", () => {
  it("postMode가 FOUND일 때 발견 텍스트와 올바른 스타일이 적용됩니다", () => {
    render(<ChatChip postMode="FOUND" />);

    const chip = screen.getByRole("note");
    expect(chip).toHaveTextContent("발견");
    expect(chip).toHaveClass("text-accent-foundItem");
    expect(chip).toHaveClass("bg-fill-accent-foundItem");
  });

  it("postMode가 LOST일 때 분실 텍스트와 올바른 스타일이 적용됩니다", () => {
    render(<ChatChip postMode="LOST" />);

    const chip = screen.getByRole("note");
    expect(chip).toHaveTextContent("분실");
    expect(chip).toHaveClass("text-accent-lostItem");
    expect(chip).toHaveClass("bg-fill-accent-lostItem");
  });

  it("기본 클래스명들이 올바르게 적용됩니다", () => {
    render(<ChatChip postMode="FOUND" />);

    const chip = screen.getByRole("note");
    expect(chip).toHaveClass("h-[18px]");
    expect(chip).toHaveClass("w-10");
    expect(chip).toHaveClass("shrink-0");
    expect(chip).toHaveClass("rounded");
    expect(chip).toHaveClass("text-caption2-semibold");
    expect(chip).toHaveClass("flex-center");
  });

  it("role이 note로 설정됩니다", () => {
    render(<ChatChip postMode="FOUND" />);

    const chip = screen.getByRole("note");
    expect(chip).toBeInTheDocument();
  });

  it("FOUND 모드일 때 모든 속성이 올바르게 렌더링됩니다", () => {
    render(<ChatChip postMode="FOUND" />);

    const chip = screen.getByRole("note");
    expect(chip).toHaveTextContent("발견");
    expect(chip).toHaveClass(
      "h-[18px] w-10 shrink-0 rounded text-caption2-semibold flex-center text-accent-foundItem bg-fill-accent-foundItem"
    );
  });

  it("LOST 모드일 때 모든 속성이 올바르게 렌더링됩니다", () => {
    render(<ChatChip postMode="LOST" />);

    const chip = screen.getByRole("note");
    expect(chip).toHaveTextContent("분실");
    expect(chip).toHaveClass(
      "h-[18px] w-10 shrink-0 rounded text-caption2-semibold flex-center text-accent-lostItem bg-fill-accent-lostItem"
    );
  });
});
