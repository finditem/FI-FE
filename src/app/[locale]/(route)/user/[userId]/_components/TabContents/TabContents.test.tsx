import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TabContents from "./TabContents";
import { MOCK_USER_PROFILE_COMMENT_DATA, MOCK_USER_PROFILE_POST_DATA } from "@/mock/data";

jest.mock("@/components/domain", () => ({
  PostListItem: () => <div data-testid="list-item">PostListItem</div>,
}));

jest.mock("../_internal/UserCommentItem/UserCommentItem", () => () => (
  <li data-testid="user-comment-item">UserCommentItem</li>
));

jest.mock("@/components/state", () => ({
  EmptyState: () => <div data-testid="empty-state">EmptyState</div>,
  LoadingState: () => <div data-testid="loading-state">LoadingState</div>,
}));

describe("TabContents", () => {
  it("로딩 중일 때는 로딩 상태가 표시되어야 합니다", () => {
    render(
      <TabContents selectedTab="posts" isLoading={true} data={[MOCK_USER_PROFILE_POST_DATA]} />
    );

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("초기 상태에서는 게시글 탭 콘텐츠가 표시되어야 합니다", () => {
    render(
      <TabContents selectedTab="posts" isLoading={false} data={[MOCK_USER_PROFILE_POST_DATA]} />
    );

    expect(screen.queryAllByTestId("list-item").length).toBeGreaterThan(0);
    expect(screen.queryAllByTestId("comment-item")).toHaveLength(0);
  });

  it("댓글 탭 선택 시 댓글 콘텐츠가 표시되어야 합니다", () => {
    render(
      <TabContents
        selectedTab="comments"
        isLoading={false}
        data={[MOCK_USER_PROFILE_COMMENT_DATA]}
      />
    );

    expect(screen.queryAllByTestId("user-comment-item").length).toBeGreaterThan(0);
    expect(screen.queryAllByTestId("list-item")).toHaveLength(0);
  });

  it("즐겨찾기 탭 선택 시 즐겨찾기 콘텐츠가 표시되어야 합니다", () => {
    render(
      <TabContents selectedTab="favorites" isLoading={false} data={[MOCK_USER_PROFILE_POST_DATA]} />
    );

    expect(screen.queryAllByTestId("list-item").length).toBeGreaterThan(0);
    expect(screen.queryAllByTestId("comment-item")).toHaveLength(0);
  });
});
