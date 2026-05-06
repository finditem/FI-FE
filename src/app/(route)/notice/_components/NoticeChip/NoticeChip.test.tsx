import { render, screen } from "@testing-library/react";
import NoticeChip from "./NoticeChip";

const LABELS = ["습득", "분실", "공지사항", "문의내역"] as const;

describe("NoticeChip", () => {
  it.each(LABELS)("%s 라벨 텍스트를 렌더합니다", (label) => {
    render(<NoticeChip label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("라벨 문단에 타이포그래피 클래스가 적용됩니다", () => {
    render(<NoticeChip label="공지사항" />);
    const paragraph = screen.getByText("공지사항");
    expect(paragraph.tagName).toBe("P");
    expect(paragraph).toHaveClass("text-[14px]", "font-semibold", "text-green-500");
  });

  it("외곽 래퍼에 여백·패딩 클래스가 적용됩니다", () => {
    const { container } = render(<NoticeChip label="분실" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("mb-[18px]", "mt-[24px]", "px-[18px]", "py-[6px]");
  });
});
