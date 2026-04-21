import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileAvatar from "./ProfileAvatar";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, onError, priority, draggable, sizes, ...props }: any) => (
    <img src={src} alt={alt} onError={onError} {...props} />
  ),
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

const FALLBACK_SRC = "/user/default-profile.svg";

describe("<ProfileAvatar />", () => {
  it("src가 있으면 해당 이미지를 렌더링합니다.", () => {
    render(<ProfileAvatar src="https://example.com/avatar.jpg" size={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("src가 없으면 기본 프로필 이미지를 렌더링합니다.", () => {
    render(<ProfileAvatar size={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("src가 null이면 기본 프로필 이미지를 렌더링합니다.", () => {
    render(<ProfileAvatar src={null} size={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("src가 빈 문자열이면 기본 프로필 이미지를 렌더링합니다.", () => {
    render(<ProfileAvatar src="   " size={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("alt 기본값은 '사용자 프로필'입니다.", () => {
    render(<ProfileAvatar size={40} />);
    expect(screen.getByAltText("사용자 프로필")).toBeInTheDocument();
  });

  it("alt prop이 전달되면 '{alt} 프로필'로 설정됩니다.", () => {
    render(<ProfileAvatar src="https://example.com/avatar.jpg" alt="홍길동" size={40} />);
    expect(screen.getByAltText("홍길동 프로필")).toBeInTheDocument();
  });

  it("이미지 로드 실패 시 기본 프로필 이미지로 대체됩니다.", () => {
    render(<ProfileAvatar src="https://broken-url.com/avatar.jpg" size={40} />);
    const img = screen.getByRole("img");

    act(() => {
      fireEvent.error(img);
    });

    expect(img).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("기본 이미지에서 onError가 발생해도 무한 루프가 발생하지 않습니다.", () => {
    render(<ProfileAvatar src={null} size={40} />);
    const img = screen.getByRole("img");

    act(() => {
      fireEvent.error(img);
    });

    expect(img).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("src prop이 변경되면 새 이미지로 업데이트됩니다.", () => {
    const { rerender } = render(<ProfileAvatar src="https://example.com/old.jpg" size={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/old.jpg");

    rerender(<ProfileAvatar src="https://example.com/new.jpg" size={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/new.jpg");
  });

  it("className prop이 img에 적용됩니다.", () => {
    render(
      <ProfileAvatar src="https://example.com/avatar.jpg" size={40} className="custom-class" />
    );
    expect(screen.getByRole("img").className).toContain("custom-class");
  });
});
