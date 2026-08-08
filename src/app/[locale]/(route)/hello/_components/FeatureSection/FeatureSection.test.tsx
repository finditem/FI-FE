import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FeatureSection from "./FeatureSection";

describe("FeatureSection", () => {
  const content = {
    title: "기능 소개 타이틀",
    description: "기능 소개 설명 문구",
  };

  it("title/description과 imageSlot을 렌더링한다", () => {
    render(
      <FeatureSection content={content} imageSlot={<div data-testid="image-slot">IMG</div>} />
    );

    expect(screen.getByText(content.title)).toBeInTheDocument();
    expect(screen.getByText(content.description)).toBeInTheDocument();
    expect(screen.getByTestId("image-slot")).toBeInTheDocument();
  });

  it('variant가 "default"면 하이라이트 배경 클래스가 없다', () => {
    const { container } = render(
      <FeatureSection
        content={content}
        variant="default"
        imageSlot={<div data-testid="image-slot" />}
      />
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).not.toHaveClass("bg-[#EFFFF9]");
  });

  it('variant가 "highlight"면 하이라이트 배경 클래스가 적용된다', () => {
    const { container } = render(
      <FeatureSection
        content={content}
        variant="highlight"
        imageSlot={<div data-testid="image-slot" />}
      />
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("bg-layoutBrand");
  });

  it("aria-labelledby 값이 title 기반으로 설정된다", () => {
    const { container } = render(
      <FeatureSection content={content} imageSlot={<div data-testid="image-slot" />} />
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", `service-introduce-${content.title}`);
  });
});
