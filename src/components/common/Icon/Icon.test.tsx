import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Icon from "./Icon";

jest.mock("./index", () => ({
  spriteIconNames: new Set(["Star"]),
  iconImports: {
    Loading: () =>
      Promise.resolve({ default: (props: any) => <svg data-testid="mock-loading" {...props} /> }),
  },
}));

describe("Icon 컴포넌트 - 스프라이트 아이콘", () => {
  it("name으로 전달된 스프라이트 아이콘을 use 태그로 렌더링합니다.", () => {
    render(<Icon name="Star" />);
    expect(document.querySelector("use")).toHaveAttribute("href", "/icons/sprite.svg#Star");
  });

  it("size prop이 지정되지 않으면 기본값 24로 렌더링됩니다.", () => {
    render(<Icon name="Star" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("size prop이 지정되면 해당 값으로 렌더링됩니다.", () => {
    render(<Icon name="Star" size={40} />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("title prop이 전달되면 aria-label이 설정되고 aria-hidden은 false입니다.", () => {
    render(<Icon name="Star" title="별 아이콘" />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "별 아이콘");
    expect(svg).toHaveAttribute("aria-hidden", "false");
  });

  it("title prop이 없으면 aria-hidden이 true입니다.", () => {
    render(<Icon name="Star" />);
    expect(document.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Icon 컴포넌트 - 동적 로딩 아이콘", () => {
  it("스프라이트에 없는 name은 lazy import로 렌더링합니다.", async () => {
    render(<Icon name="Loading" />);
    expect(await screen.findByTestId("mock-loading")).toBeInTheDocument();
  });

  it("존재하지 않는 name을 전달하면 에러가 발생합니다.", () => {
    // @ts-expect-error 의도적 오류 테스트
    expect(() => render(<Icon name="NotExist" />)).toThrow();
  });
});
