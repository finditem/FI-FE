import { render, screen } from "@testing-library/react";
import LoadingState from "./LoadingState";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: { name: string }) => <div data-testid="icon" data-name={name} />,
}));

describe("LoadingState", () => {
  describe("접근성", () => {
    it("role='status'가 적용된다", () => {
      render(<LoadingState />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("aria-live='polite'가 적용된다", () => {
      render(<LoadingState />);

      expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("title", () => {
    it("title 기본값은 '페이지 로딩 중...'이다", () => {
      render(<LoadingState />);

      expect(screen.getByText("페이지 로딩 중...")).toBeInTheDocument();
    });

    it("title prop을 전달하면 해당 값을 렌더링한다", () => {
      render(<LoadingState title="데이터를 불러오는 중..." />);

      expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
    });
  });

  describe("아이콘", () => {
    it("Loading 아이콘을 렌더링한다", () => {
      render(<LoadingState />);

      expect(screen.getByTestId("icon")).toHaveAttribute("data-name", "Loading");
    });
  });
});
