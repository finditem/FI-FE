import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LogoLink from "./LogoLink";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/common", () => ({
  Icon: ({ name, title }: any) => <span data-testid={`icon-${name}`} title={title} />,
}));

describe("<LogoLink />", () => {
  it("메인페이지(/) 링크가 렌더된다", () => {
    render(<LogoLink />);
    expect(screen.getByRole("link", { name: "메인페이지 이동" })).toHaveAttribute("href", "/");
  });

  it("'찾아줘!' 텍스트가 렌더된다", () => {
    render(<LogoLink />);
    expect(screen.getByText("찾아줘!")).toBeInTheDocument();
  });

  it("로고 아이콘이 렌더된다", () => {
    render(<LogoLink />);
    expect(screen.getByTestId("icon-Logo")).toBeInTheDocument();
  });
});
