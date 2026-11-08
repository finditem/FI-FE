import { render, screen } from "@testing-library/react";
import FourthSection from "./FourthSection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, fill, sizes, loader, blurDataURL, placeholder, ...rest } = props;
    return <img {...rest} />;
  },
}));

const mockUseInView = jest.fn();
jest.mock("../../../_hooks/useInView/useInView", () => ({
  __esModule: true,
  useInView: () => mockUseInView(),
}));

describe("FourthSection", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
  });

  it("inView가 false면 첫 번째 이미지에 fade-in이 붙지 않습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });

    render(<FourthSection />);

    const imgs = screen.getAllByRole("presentation");
    expect(imgs[0]).not.toHaveClass("fade-in");
    expect(imgs[0]).toHaveClass("opacity-0");
  });

  it("inView가 true면 첫 번째 이미지에 fade-in이 붙습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    render(<FourthSection />);

    const imgs = screen.getAllByRole("presentation");
    expect(imgs[0]).toHaveClass("fade-in");
  });

  it("hook에서 받은 ref를 중간 div에 전달합니다", () => {
    const refSpy = jest.fn();

    mockUseInView.mockReturnValue({
      ref: refSpy,
      inView: false,
    });

    render(<FourthSection />);

    expect(refSpy).toHaveBeenCalled();
  });
});
