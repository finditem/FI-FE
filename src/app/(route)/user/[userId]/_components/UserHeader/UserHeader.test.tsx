import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserHeader from "./UserHeader";
import { MOCK_USER_PROFILE_DATA_BY_POSTS } from "@/mock/data";

jest.mock("@/components/common", () => ({
  Icon: ({ name, size, className }: any) => (
    <svg data-testid="icon" data-name={name} data-size={size} className={className} />
  ),
  ProfileAvatar: ({ src, alt, size }: any) => (
    <img src={src || "https://picsum.photos/400/300?random=1"} alt={alt} data-size={size} />
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src }: { src: string }) => <img src={src} alt="test" />,
}));

describe("UserHeader", () => {
  it("프로필 이미지가 표시되어야 합니다", () => {
    render(<UserHeader data={MOCK_USER_PROFILE_DATA_BY_POSTS.profile} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("프로필 이미지가 없을 경우 대체 이미지가 표시되어야 합니다.", () => {
    render(<UserHeader data={{ nickname: "test", profileImg: "" }} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://picsum.photos/400/300?random=1");
  });

  it("닉네임이 표시되어야 합니다", () => {
    render(<UserHeader data={MOCK_USER_PROFILE_DATA_BY_POSTS.profile} />);
    expect(screen.getByText(MOCK_USER_PROFILE_DATA_BY_POSTS.profile.nickname)).toBeInTheDocument();
  });

  it("닉네임이 없을 경우 로딩 중...이 표시되어야 합니다", () => {
    render(<UserHeader data={{ nickname: "", profileImg: "" }} />);
    expect(screen.getByText("로딩 중..."));
  });
});
