import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import NoticeFilter from "./NoticeFilter";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const mockSearchUpdateQuery = jest.fn();

describe("NoticeFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  it("sortType이 없으면 필터에 최신순이 표시됩니다", () => {
    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    expect(screen.getByRole("button", { name: "공지사항 정렬 필터" })).toHaveTextContent("최신순");
  });

  it("일치하지 않는 sortType이면 최신순으로 표시됩니다", () => {
    const params = new URLSearchParams();
    params.set("sortType", "unknown");
    (useSearchParams as jest.Mock).mockReturnValue(params);

    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    expect(screen.getByRole("button", { name: "공지사항 정렬 필터" })).toHaveTextContent("최신순");
  });

  it.each([
    ["oldest", "오래된 순"],
    ["OLDEST", "오래된 순"],
    ["most_viewed", "조회 많은 순"],
    ["MOST_VIEWED", "조회 많은 순"],
  ] as const)("sortType이 %s이면 %s이 표시됩니다", (sortTypeParam, expectedLabel) => {
    const params = new URLSearchParams();
    params.set("sortType", sortTypeParam);
    (useSearchParams as jest.Mock).mockReturnValue(params);

    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    expect(screen.getByRole("button", { name: "공지사항 정렬 필터" })).toHaveTextContent(
      expectedLabel
    );
  });

  it("필터 버튼 클릭 시 정렬 옵션 버튼들이 보입니다", async () => {
    const user = userEvent.setup();
    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);

    await user.click(screen.getByRole("button", { name: "공지사항 정렬 필터" }));

    expect(screen.getByRole("button", { name: "최신순" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "오래된 순" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "조회 많은 순" })).toBeInTheDocument();
  });

  it("최신순 옵션 클릭 시 sortType을 제거하도록 searchUpdateQuery를 호출합니다", async () => {
    const user = userEvent.setup();
    const params = new URLSearchParams();
    params.set("sortType", "oldest");
    (useSearchParams as jest.Mock).mockReturnValue(params);

    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    await user.click(screen.getByRole("button", { name: "공지사항 정렬 필터" }));
    await user.click(screen.getByRole("button", { name: "최신순" }));

    expect(mockSearchUpdateQuery).toHaveBeenCalledWith("sortType", undefined);
  });

  it("오래된 순 옵션 클릭 시 searchUpdateQuery를 호출합니다", async () => {
    const user = userEvent.setup();
    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    await user.click(screen.getByRole("button", { name: "공지사항 정렬 필터" }));
    await user.click(screen.getByRole("button", { name: "오래된 순" }));

    expect(mockSearchUpdateQuery).toHaveBeenCalledWith("sortType", "oldest");
  });

  it("조회 많은 순 옵션 클릭 시 searchUpdateQuery를 호출합니다", async () => {
    const user = userEvent.setup();
    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    await user.click(screen.getByRole("button", { name: "공지사항 정렬 필터" }));
    await user.click(screen.getByRole("button", { name: "조회 많은 순" }));

    expect(mockSearchUpdateQuery).toHaveBeenCalledWith("sortType", "most_viewed");
  });

  it("옵션 선택 후 드롭다운이 닫힙니다", async () => {
    const user = userEvent.setup();
    render(<NoticeFilter searchUpdateQuery={mockSearchUpdateQuery} />);
    await user.click(screen.getByRole("button", { name: "공지사항 정렬 필터" }));
    await user.click(screen.getByRole("button", { name: "조회 많은 순" }));

    expect(screen.queryByRole("button", { name: "오래된 순" })).not.toBeInTheDocument();
  });
});
