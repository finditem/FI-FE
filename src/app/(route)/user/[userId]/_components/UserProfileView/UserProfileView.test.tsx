import React from "react";
import { render, screen } from "@testing-library/react";
import { UserProfileView } from "..";
import { MOCK_USER_PROFILE_DATA_BY_POSTS } from "@/mock/data";

const mockNotFound = jest.fn();
const mockUseParams = jest.fn();
const mockUseGetUserProfileById = jest.fn();
const mockUseUserProfileTabQuery = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
}));

jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useParams: () => mockUseParams(),
    notFound: () => mockNotFound(),
  };
});

jest.mock("@/api/fetch/user", () => ({
  useGetUserProfileById: (...args: unknown[]) => mockUseGetUserProfileById(...args),
}));

jest.mock("../../_hooks/useUserProfileTabQuery/useUserProfileTabQuery", () => ({
  useUserProfileTabQuery: () => mockUseUserProfileTabQuery(),
}));

jest.mock("@/components/domain", () => ({
  Tab: ({ selected, ariaLabel }: { selected: string; ariaLabel: string }) => (
    <div role="tablist" aria-label={ariaLabel}>
      TAB:{selected}
    </div>
  ),
}));

jest.mock("../UserHeader/UserHeader", () => ({
  __esModule: true,
  default: ({ data }: { data?: { nickname: string } }) => <div>{data?.nickname ?? ""}</div>,
}));

jest.mock("../TabContents/TabContents", () => ({
  __esModule: true,
  default: ({ selectedTab, isLoading }: { selectedTab: string; isLoading: boolean }) => (
    <div>
      TAB_CONTENTS:{selectedTab}:{isLoading ? "loading" : "idle"}
    </div>
  ),
}));

describe("UserProfileView", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ userId: "1" });
    mockUseUserProfileTabQuery.mockReturnValue({
      tab: "post",
      updateTabQuery: jest.fn(),
    });

    mockUseGetUserProfileById.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
  });

  it("data 또는 userId가 없을 때 NotFound가 렌더링되어야 합니다", () => {
    mockUseParams.mockReturnValue({ userId: undefined });

    render(<UserProfileView />);

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("data가 있을 때 UserProfileView가 렌더링되어야 합니다", () => {
    mockUseGetUserProfileById.mockReturnValue({
      data: MOCK_USER_PROFILE_DATA_BY_POSTS,
      isLoading: false,
      isError: false,
    });

    render(<UserProfileView />);

    expect(screen.getByText("짱구")).toBeInTheDocument();
  });

  it("h1 태그 스크린 리더 텍스트가 올바르게 설정되어야 합니다", () => {
    mockUseGetUserProfileById.mockReturnValue({
      data: MOCK_USER_PROFILE_DATA_BY_POSTS,
      isLoading: false,
      isError: false,
    });

    render(<UserProfileView />);

    expect(screen.getByRole("heading", { level: 1, name: "짱구 프로필" })).toBeInTheDocument();
  });
});
