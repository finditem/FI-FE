import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublicDetailHeader from "./PublicDetailHeader";

const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("PublicDetailHeader", () => {
  beforeEach(() => {
    mockPush.mockClear();
    sessionStorage.clear();
  });

  it("police24 로고 이미지를 렌더합니다", () => {
    mockSearchParams = new URLSearchParams();
    const { container } = render(<PublicDetailHeader />);
    expect(container.querySelector('img[src*="police24"]')).toBeInTheDocument();
  });

  it("검색 버튼을 렌더합니다", () => {
    mockSearchParams = new URLSearchParams();
    render(<PublicDetailHeader />);
    expect(screen.getByRole("button", { name: "검색" })).toBeInTheDocument();
  });

  it("type이 found이면 검색 클릭 시 /public-data/found/search로 이동합니다", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams({ type: "found" });
    render(<PublicDetailHeader />);
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(mockPush).toHaveBeenCalledWith("/public-data/found/search");
  });

  it("type이 lost이면 검색 클릭 시 /public-data/lost/search로 이동합니다", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams({ type: "lost" });
    render(<PublicDetailHeader />);
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(mockPush).toHaveBeenCalledWith("/public-data/lost/search");
  });

  it("type이 없으면 기본값 lost로 /public-data/lost/search로 이동합니다", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams();
    render(<PublicDetailHeader />);
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(mockPush).toHaveBeenCalledWith("/public-data/lost/search");
  });

  it("type이 유효하지 않은 값이면 lost로 폴백해 /public-data/lost/search로 이동합니다", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams({ type: "unknown" });
    render(<PublicDetailHeader />);
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(mockPush).toHaveBeenCalledWith("/public-data/lost/search");
  });
});
