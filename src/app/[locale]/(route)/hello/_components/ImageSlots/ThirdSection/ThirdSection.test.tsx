import { render } from "@testing-library/react";
import ThirdSection from "./ThirdSection";
import { CHAT_ITEMS, CHAT_STACK_LEFT, PHONE, SIDE_MESSAGES } from "./THIRD_SECTION_PARTS";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockUseInView = jest.fn();
jest.mock("../../../_hooks/useInView/useInView", () => ({
  __esModule: true,
  useInView: () => mockUseInView(),
}));

describe("ThirdSection", () => {
  beforeEach(() => {
    mockUseInView.mockReset();
  });

  it("전체 이미지 개수가 기대값과 같습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });

    const { container } = render(<ThirdSection />);

    const imgs = Array.from(container.querySelectorAll("img"));

    const expected = 1 + CHAT_ITEMS.length + CHAT_STACK_LEFT.length + 1 + SIDE_MESSAGES.length;
    expect(imgs).toHaveLength(expected);

    expect(imgs[0]).toHaveAttribute("src", PHONE.src);
  });

  it("inView가 false면 채팅 관련 이미지에 chat-animate가 붙지 않습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: false,
    });

    const { container } = render(<ThirdSection />);

    const imgs = Array.from(container.querySelectorAll("img"));

    const start = 1;
    const chatEnd = start + CHAT_ITEMS.length;
    const stackEnd = chatEnd + CHAT_STACK_LEFT.length;
    const lastIndex = stackEnd;

    const chatRelated = [
      ...imgs.slice(start, chatEnd),
      ...imgs.slice(chatEnd, stackEnd),
      imgs[lastIndex],
    ];

    chatRelated.forEach((img) => {
      expect(img).not.toHaveClass("chat-animate");
    });
  });

  it("inView가 true면 채팅 관련 이미지에 chat-animate가 붙습니다", () => {
    mockUseInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });

    const { container } = render(<ThirdSection />);

    const imgs = Array.from(container.querySelectorAll("img"));

    const start = 1;
    const chatEnd = start + CHAT_ITEMS.length;
    const stackEnd = chatEnd + CHAT_STACK_LEFT.length;
    const lastIndex = stackEnd;

    const chatRelated = [
      ...imgs.slice(start, chatEnd),
      ...imgs.slice(chatEnd, stackEnd),
      imgs[lastIndex],
    ];

    chatRelated.forEach((img) => {
      expect(img).toHaveClass("chat-animate");
    });
  });

  it("hook에서 받은 ref를 중간 컨테이너에 전달합니다", () => {
    const refSpy = jest.fn();

    mockUseInView.mockReturnValue({
      ref: refSpy,
      inView: false,
    });

    render(<ThirdSection />);

    expect(refSpy).toHaveBeenCalled();
  });
});
