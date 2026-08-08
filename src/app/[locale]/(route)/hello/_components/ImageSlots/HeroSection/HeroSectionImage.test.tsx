import { render } from "@testing-library/react";
import HeroSection from "./HeroSection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, fill, sizes, loader, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe("HeroSection", () => {
  it("5개의 이미지를 렌더링합니다", () => {
    const { container } = render(<HeroSection />);

    const imgs = Array.from(container.querySelectorAll("img"));
    expect(imgs).toHaveLength(5);
  });

  it("각 이미지가 올바른 src를 가집니다", () => {
    const { container } = render(<HeroSection />);

    const imgs = Array.from(container.querySelectorAll("img"));
    const srcs = imgs.map((img) => img.getAttribute("src"));

    expect(srcs).toEqual([
      "/hello/hero/service-hero-wallet.svg",
      "/hello/hero/service-hero-glass.svg",
      "/hello/hero/service-hero-background.svg",
      "/hello/hero/service-hero-phone.svg",
      "/hello/hero/service-hero-bag.svg",
    ]);
  });

  it("모든 이미지가 draggable=false 및 select-none 클래스를 가집니다", () => {
    const { container } = render(<HeroSection />);

    const imgs = Array.from(container.querySelectorAll("img"));

    imgs.forEach((img) => {
      expect(img).toHaveAttribute("draggable", "false");
      expect(img).toHaveClass("select-none");
    });
  });
});
