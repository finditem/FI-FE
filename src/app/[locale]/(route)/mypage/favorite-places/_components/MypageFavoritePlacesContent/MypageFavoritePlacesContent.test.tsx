import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useGetUserMeFavoritePlaces } from "@/api/fetch/user";
import MypageFavoritePlacesContent from "./MypageFavoritePlacesContent";

jest.mock("@/api/fetch/user", () => ({
  useGetUserMeFavoritePlaces: jest.fn(),
}));

jest.mock("@/components", () => ({
  Filter: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  MypageEmptyUI: ({ pageType }: { pageType: string }) => <div>empty:{pageType}</div>,
  PlaceCard: ({ place }: { place: { name: string } }) => <li>{place.name}</li>,
  PlaceCardSkeleton: () => <div>loading</div>,
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: jest.fn() }),
}));

jest.mock("@/hooks", () => ({
  useHorizontalDragScroll: () => ({ ref: { current: null }, onMouseDown: jest.fn() }),
  useInfiniteScroll: () => ({ ref: jest.fn() }),
}));

const mockUseGetUserMeFavoritePlaces = useGetUserMeFavoritePlaces as jest.Mock;

const mockQuery = (data: { places: { placeId: number; name: string }[]; totalCount?: number }) => {
  mockUseGetUserMeFavoritePlaces.mockReturnValue({
    data,
    isLoading: false,
    isError: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
  });
};

const PLACES = [
  { placeId: 1, name: "프레고 클럽" },
  { placeId: 2, name: "성수 노루" },
];

describe("MypageFavoritePlacesContent", () => {
  beforeEach(() => {
    mockUseGetUserMeFavoritePlaces.mockReset();
  });

  it("전체 보기에서 찜한 장소가 없으면 필터 칩 없이 빈 상태만 렌더된다", () => {
    mockQuery({ places: [], totalCount: 0 });
    render(<MypageFavoritePlacesContent />);

    expect(screen.getByText("empty:favoritePlaces")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "모두보기" })).not.toBeInTheDocument();
  });

  it("찜한 장소가 있으면 필터 칩과 장소 카드가 렌더된다", () => {
    mockQuery({ places: PLACES, totalCount: 2 });
    render(<MypageFavoritePlacesContent />);

    ["모두보기", "팝업", "카페", "맛집"].forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
    expect(screen.getByText("프레고 클럽")).toBeInTheDocument();
    expect(screen.getByText("성수 노루")).toBeInTheDocument();
  });

  it("totalCount가 있으면 개수 문구가 렌더된다", () => {
    mockQuery({ places: PLACES, totalCount: 2 });
    render(<MypageFavoritePlacesContent />);

    expect(screen.getByText("총 2곳을 찜했어요.")).toBeInTheDocument();
  });

  it("totalCount가 없으면 개수 문구가 렌더되지 않는다", () => {
    mockQuery({ places: PLACES });
    render(<MypageFavoritePlacesContent />);

    expect(screen.queryByText(/곳을 찜했어요/)).not.toBeInTheDocument();
  });

  it("필터 칩을 누르면 해당 종류로 목록을 조회한다", () => {
    mockQuery({ places: PLACES, totalCount: 2 });
    render(<MypageFavoritePlacesContent />);

    expect(mockUseGetUserMeFavoritePlaces).toHaveBeenLastCalledWith(undefined);
    fireEvent.click(screen.getByRole("button", { name: "카페" }));
    expect(mockUseGetUserMeFavoritePlaces).toHaveBeenLastCalledWith("CAFE");
  });

  it("필터 결과가 비어 있으면 필터 칩은 유지하고 빈 상태를 렌더한다", () => {
    mockQuery({ places: PLACES, totalCount: 2 });
    render(<MypageFavoritePlacesContent />);

    mockQuery({ places: [], totalCount: 0 });
    fireEvent.click(screen.getByRole("button", { name: "팝업" }));

    expect(screen.getByRole("button", { name: "모두보기" })).toBeInTheDocument();
    expect(screen.getByText("empty:favoritePlaces")).toBeInTheDocument();
  });

  it("로딩 중에는 스켈레톤을 렌더한다", () => {
    mockUseGetUserMeFavoritePlaces.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
    });
    render(<MypageFavoritePlacesContent />);

    expect(screen.getByText("loading")).toBeInTheDocument();
  });
});
