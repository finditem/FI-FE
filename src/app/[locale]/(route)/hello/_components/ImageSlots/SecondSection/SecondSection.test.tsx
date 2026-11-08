import { render, screen } from "@testing-library/react";
import SecondSection from "./SecondSection";

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

describe("SecondSection", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
  });

  it("inView가 false면 첫 번째 오버레이 이미지에 fade-out-once가 붙지 않습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });

    render(<SecondSection />);

    const imgs = screen.getAllByRole("presentation");
    expect(imgs[1]).not.toHaveClass("fade-out-once");
  });

  it("inView가 true면 첫 번째 오버레이 이미지에 fade-out-once가 붙습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    render(<SecondSection />);

    const imgs = screen.getAllByRole("presentation");
    expect(imgs[1]).toHaveClass("fade-out-once");
  });

  it("hook에서 받은 ref를 중간 div에 전달합니다", () => {
    const refSpy = jest.fn();

    mockUseInView.mockReturnValue({
      ref: refSpy,
      inView: false,
    });

    render(<SecondSection />);

    expect(refSpy).toHaveBeenCalled();
  });
});
