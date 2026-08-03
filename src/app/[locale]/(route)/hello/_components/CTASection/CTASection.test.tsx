import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CTASection from "./CTASection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("CTASection", () => {
  it("CTA 섹션의 주요 텍스트와 버튼을 렌더링한다", () => {
    render(<CTASection />);

    expect(screen.getByText("분실의 걱정을 가볍게, 찾아줘!")).toBeInTheDocument();

    expect(
      screen.getByText("'찾아줘!'와 함께라면, 잃어버린 순간도 조금은 덜 답답해질 거예요.")
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "찾아줘 홈으로 이동" });
    expect(link).toHaveAttribute("href", "/");
  });
});
