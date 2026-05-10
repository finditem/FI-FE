import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ListSearch from "./ListSearch";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("./_internal/RegionSearchView", () => ({
  __esModule: true,
  default: ({ searchQuery }: { searchQuery: string }) => (
    <div data-testid="region-search-view">{searchQuery}</div>
  ),
}));

describe("<ListSearch />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("검색 입력창과 플레이스홀더를 렌더링한다.", () => {
    render(<ListSearch />);

    expect(screen.getByPlaceholderText("시/군/구를 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByTestId("region-search-view")).toHaveTextContent("");
  });

  it("입력하면 RegionSearchView에 검색어가 전달된다.", async () => {
    const user = userEvent.setup();
    render(<ListSearch />);

    const input = screen.getByPlaceholderText("시/군/구를 입력해 주세요.");
    await user.type(input, "강남");

    expect(screen.getByTestId("region-search-view")).toHaveTextContent("강남");
  });

  it("값이 있을 때 제출하면 trim한 지역으로 채팅 목록으로 replace한다.", async () => {
    const user = userEvent.setup();
    render(<ListSearch />);

    const input = screen.getByPlaceholderText("시/군/구를 입력해 주세요.");
    await user.type(input, "  성동구  ");
    await user.keyboard("{Enter}");

    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/chat?&region=성동구");
  });

  it("공백만 있으면 replace를 호출하지 않는다.", async () => {
    const user = userEvent.setup();
    render(<ListSearch />);

    const input = screen.getByPlaceholderText("시/군/구를 입력해 주세요.");
    await user.type(input, "   ");
    await user.keyboard("{Enter}");

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
