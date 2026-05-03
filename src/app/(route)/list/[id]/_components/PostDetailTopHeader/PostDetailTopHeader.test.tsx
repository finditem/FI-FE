import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostDetailTopHeader from "./PostDetailTopHeader";
import { useToggleFavorite } from "../../_hooks/useToggleFavorite";
import { useGetMetaData } from "@/api/fetch/post";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt ?? ""} />,
}));

jest.mock("../../_hooks/useToggleFavorite");

jest.mock("@/api/fetch/post", () => ({
  useGetMetaData: jest.fn(),
}));

jest.mock("../PostActionMenu/PostActionMenu", () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (open ? <div data-testid="post-action-menu" /> : null),
}));

jest.mock("@/components/domain", () => ({
  ContentShareModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="content-share-modal" /> : null,
}));

const mockHandleToggleFavorite = jest.fn();

const mockPostData = {
  isMine: false,
  writerId: 1,
  favoriteStatus: false,
  postStatus: "SEARCHING" as const,
};

describe("PostDetailTopHeader", () => {
  beforeEach(() => {
    (useToggleFavorite as jest.Mock).mockReturnValue({
      handleToggleFavorite: mockHandleToggleFavorite,
      isPending: false,
    });
    (useGetMetaData as jest.Mock).mockReturnValue({
      data: {
        result: {
          title: "테스트 게시글",
          summary: "테스트 설명",
          address: "서울특별시 마포구",
          likeCount: 0,
          commentCount: 0,
          viewCount: 0,
        },
      },
    });
  });

  it("즐겨찾기 버튼이 렌더링되어야 한다.", () => {
    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    expect(screen.getByRole("button", { name: "게시글 즐겨찾기" })).toBeInTheDocument();
  });

  it("공유 버튼이 렌더링되어야 한다.", () => {
    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    expect(screen.getByRole("button", { name: "게시글 공유" })).toBeInTheDocument();
  });

  it("메뉴 버튼이 렌더링되어야 한다.", () => {
    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    expect(screen.getByRole("button", { name: "게시글 메뉴" })).toBeInTheDocument();
  });

  it("공유 버튼 클릭 시 공유 모달이 열려야 한다.", async () => {
    const user = userEvent.setup();
    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    await user.click(screen.getByRole("button", { name: "게시글 공유" }));

    expect(screen.getByTestId("content-share-modal")).toBeInTheDocument();
  });

  it("메뉴 버튼 클릭 시 액션 메뉴가 열려야 한다.", async () => {
    const user = userEvent.setup();
    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    await user.click(screen.getByRole("button", { name: "게시글 메뉴" }));

    expect(screen.getByTestId("post-action-menu")).toBeInTheDocument();
  });

  it("즐겨찾기 버튼 클릭 시 handleToggleFavorite이 호출되어야 한다.", async () => {
    const user = userEvent.setup();
    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    await user.click(screen.getByRole("button", { name: "게시글 즐겨찾기" }));

    expect(mockHandleToggleFavorite).toHaveBeenCalledWith(false);
  });

  it("isPending이 true일 때 즐겨찾기 버튼이 비활성화되어야 한다.", () => {
    (useToggleFavorite as jest.Mock).mockReturnValue({
      handleToggleFavorite: mockHandleToggleFavorite,
      isPending: true,
    });

    render(<PostDetailTopHeader postId={1} postData={mockPostData} />);

    expect(screen.getByRole("button", { name: "게시글 즐겨찾기" })).toBeDisabled();
  });

  it("favoriteStatus가 true일 때 즐겨찾기 버튼이 활성 상태(aria-pressed=true)여야 한다.", () => {
    render(<PostDetailTopHeader postId={1} postData={{ ...mockPostData, favoriteStatus: true }} />);

    expect(screen.getByRole("button", { name: "게시글 즐겨찾기" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
