import { render } from "@testing-library/react";
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

// 이미지는 alt 유무와 관계없이 렌더 순서대로 찾는다. 빈 alt 이미지만 presentation 역할을 가져,
// 대체 텍스트를 채우면 역할 기반 조회로는 찾을 수 없기 때문이다.
describe("FourthSection", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
  });

  it("inView가 false면 첫 번째 이미지에 fade-in이 붙지 않습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });

    const { container } = render(<FourthSection />);

    const imgs = container.querySelectorAll("img");
    expect(imgs[0]).not.toHaveClass("fade-in");
    expect(imgs[0]).toHaveClass("opacity-0");
  });

  it("inView가 true면 첫 번째 이미지에 fade-in이 붙습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    const { container } = render(<FourthSection />);

    const imgs = container.querySelectorAll("img");
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
