import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReadOnlyCommentItem from "./ReadOnlyCommentItem";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
  formatDate: () => "2024.01.01",
}));

jest.mock("@/components/common", () => ({
  ProfileAvatar: () => <div data-testid="profile-avatar" />,
  Chip: ({ label }: any) => <div data-testid="chip">{label}</div>,
}));

const mockData = {
  isAdmin: false,
  userImageUrl: "",
  userName: "테스트유저",
  content: "댓글 내용입니다.",
  createdAt: "2024-01-01T00:00:00Z",
};

describe("<ReadOnlyCommentItem />", () => {
  it("작성자 이름을 렌더링합니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.getByText("테스트유저")).toBeInTheDocument();
  });

  it("댓글 내용을 렌더링합니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.getByText("댓글 내용입니다.")).toBeInTheDocument();
  });

  it("프로필 아바타를 렌더링합니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.getByTestId("profile-avatar")).toBeInTheDocument();
  });

  it("작성 시간을 렌더링합니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.getByText("2024.01.01")).toBeInTheDocument();
  });

  it("isAdmin이 true이면 관리자 칩을 렌더링합니다.", () => {
    render(<ReadOnlyCommentItem data={{ ...mockData, isAdmin: true } as any} />);
    expect(screen.getByTestId("chip")).toBeInTheDocument();
    expect(screen.getByText("관리자")).toBeInTheDocument();
  });

  it("isAdmin이 false이면 관리자 칩을 렌더링하지 않습니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.queryByTestId("chip")).not.toBeInTheDocument();
  });

  it("isAdmin이 true이면 배경색 클래스가 적용됩니다.", () => {
    render(<ReadOnlyCommentItem data={{ ...mockData, isAdmin: true } as any} />);
    expect(screen.getByRole("article").className).toContain("bg-fill-neutral-strong-default");
  });

  it("isAdmin이 false이면 흰색 배경 클래스가 적용됩니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.getByRole("article").className).toContain("bg-white");
  });

  it("images가 있으면 이미지를 렌더링합니다.", () => {
    render(
      <ReadOnlyCommentItem
        data={mockData as any}
        images={["https://example.com/img1.jpg", "https://example.com/img2.jpg"]}
      />
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("images가 없으면 이미지를 렌더링하지 않습니다.", () => {
    render(<ReadOnlyCommentItem data={mockData as any} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
