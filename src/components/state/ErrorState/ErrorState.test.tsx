import { render, screen } from "@testing-library/react";
import ErrorState from "./ErrorState";

jest.mock("@/components/common", () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <div data-testid="icon" data-name={name} data-size={size} />
  ),
}));

describe("ErrorState", () => {
  describe("접근성", () => {
    it("role='alert'이 적용된다", () => {
      render(<ErrorState icon={{}} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("title", () => {
    it("title 기본값은 '오류가 발생했어요.'이다", () => {
      render(<ErrorState icon={{}} />);

      expect(screen.getByText("오류가 발생했어요.")).toBeInTheDocument();
    });

    it("title prop을 전달하면 해당 값을 렌더링한다", () => {
      render(<ErrorState icon={{}} title="권한이 없습니다." />);

      expect(screen.getByText("권한이 없습니다.")).toBeInTheDocument();
    });
  });

  describe("description", () => {
    it("description이 있으면 렌더링한다", () => {
      render(<ErrorState icon={{}} description="잠시 후 다시 시도해 주세요." />);

      expect(screen.getByText("잠시 후 다시 시도해 주세요.")).toBeInTheDocument();
    });

    it("description이 없으면 렌더링하지 않는다", () => {
      render(<ErrorState icon={{}} />);

      expect(screen.queryByText("잠시 후 다시 시도해 주세요.")).not.toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("children이 있으면 렌더링한다", () => {
      render(
        <ErrorState icon={{}}>
          <button>다시 시도하기</button>
        </ErrorState>
      );

      expect(screen.getByRole("button", { name: "다시 시도하기" })).toBeInTheDocument();
    });
  });

  describe("아이콘", () => {
    it("iconName 기본값은 'Error'이다", () => {
      render(<ErrorState icon={{}} />);

      expect(screen.getByTestId("icon")).toHaveAttribute("data-name", "Error");
    });

    it("iconSize 기본값은 30이다", () => {
      render(<ErrorState icon={{}} />);

      expect(screen.getByTestId("icon")).toHaveAttribute("data-size", "30");
    });

    it("icon prop을 전달하면 해당 값을 렌더링한다", () => {
      render(<ErrorState icon={{ iconName: "NotFound", iconSize: 40 }} />);

      const icon = screen.getByTestId("icon");
      expect(icon).toHaveAttribute("data-name", "NotFound");
      expect(icon).toHaveAttribute("data-size", "40");
    });
  });
});
