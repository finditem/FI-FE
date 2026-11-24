import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CTASection from "./CTASection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// 서비스명 변경(찾아줘 → 찾길) 전후 모두 통과하도록 서비스명 부분만 두 이름을 허용한다.
describe("CTASection", () => {
  it("CTA 섹션의 주요 텍스트와 버튼을 렌더링한다", () => {
    const { container } = render(<CTASection />);

    const heading = screen.getByRole("heading", { name: /^분실의 걱정을 가볍게, (찾아줘!|찾길)$/ });
    expect(heading).toBeInTheDocument();
    expect(container.querySelector("section")).toHaveAttribute("aria-labelledby", heading.id);

    expect(
      screen.getByText(
        /^'(찾아줘!'와|찾길'과) 함께라면, 잃어버린 순간도 조금은 덜 답답해질 거예요\.$/
      )
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /^(찾아줘|찾길) 홈으로 이동$/ });
    expect(link).toHaveAttribute("href", "/");
  });
});
