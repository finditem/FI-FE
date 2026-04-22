import { render, screen } from "@testing-library/react";
import BaseStateLayout from "./BaseStateLayout";

describe("BaseStateLayout", () => {
  it("자식 요소를 렌더링한다", () => {
    render(
      <BaseStateLayout>
        <p>자식 요소</p>
      </BaseStateLayout>
    );

    expect(screen.getByText("자식 요소")).toBeInTheDocument();
  });

  it("className prop이 레이아웃에 적용된다", () => {
    const { container } = render(
      <BaseStateLayout className="custom-class">
        <p>자식 요소</p>
      </BaseStateLayout>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("기본 레이아웃 클래스가 적용된다", () => {
    const { container } = render(
      <BaseStateLayout>
        <p>자식 요소</p>
      </BaseStateLayout>
    );

    expect(container.firstChild).toHaveClass("h-full", "w-full");
  });
});
