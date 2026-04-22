import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

jest.mock("@/components/common", () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid="icon" data-name={name} data-size={size} />
  ),
}));

describe("EmptyState", () => {
  const defaultIcon = { iconName: "EmptyPostSearch" as const, iconSize: 50 };

  describe("아이콘", () => {
    it("전달된 아이콘을 렌더링한다", () => {
      render(<EmptyState icon={defaultIcon} />);

      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("data-name", "EmptyPostSearch");
      expect(icon).toHaveAttribute("data-size", "50");
    });
  });

  describe("title", () => {
    it("title이 있으면 렌더링한다", () => {
      render(<EmptyState icon={defaultIcon} title="데이터가 없습니다." />);

      expect(screen.getByText("데이터가 없습니다.")).toBeInTheDocument();
    });

    it("title이 없으면 렌더링하지 않는다", () => {
      render(<EmptyState icon={defaultIcon} />);

      expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    });
  });

  describe("description", () => {
    it("description이 있으면 렌더링한다", () => {
      render(<EmptyState icon={defaultIcon} description="아직 등록된 데이터가 없어요." />);

      expect(screen.getByText("아직 등록된 데이터가 없어요.")).toBeInTheDocument();
    });

    it("description이 없으면 렌더링하지 않는다", () => {
      render(<EmptyState icon={defaultIcon} title="데이터가 없습니다." />);

      expect(screen.queryByText("아직 등록된 데이터가 없어요.")).not.toBeInTheDocument();
    });
  });
});
