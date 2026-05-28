import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import FilterDropdown from "./FilterDropdown";
import { SORT_OPTIONS, TYPE_OPTIONS } from "../CHATLIST_CONST";
import { useSearchParams } from "next/navigation";

const mockSearchUpdateQuery = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  Filter: ({ children, onClick, ariaLabel, onSelected, className }: any) => (
    <button
      data-testid={`filter-${ariaLabel}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-selected={onSelected}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe("FilterDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Sort 필터", () => {
    it("기본 상태에서 최신순이 표시됩니다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      expect(filterButton).toHaveTextContent("최신순");
    });

    it("sort 파라미터가 latest일 때 최신순이 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("sort", "latest");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      expect(filterButton).toHaveTextContent("최신순");
    });

    it("sort 파라미터가 oldest일 때 오래된순이 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("sort", "oldest");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      expect(filterButton).toHaveTextContent("오래된순");
    });

    it("sort 파라미터가 latest(기본값)일 때 Filter는 비활성으로 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("sort", "latest");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      expect(filterButton).toHaveAttribute("aria-selected", "false");
    });

    it("sort 파라미터가 oldest일 때 Filter가 선택된 상태로 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("sort", "oldest");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      expect(filterButton).toHaveAttribute("aria-selected", "true");
    });

    it("sort 파라미터가 없을 때 Filter가 선택되지 않은 상태로 표시됩니다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      expect(filterButton).toHaveAttribute("aria-selected", "false");
    });

    it("Filter 버튼 클릭 시 드롭다운이 열립니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      await user.click(filterButton);

      // 드롭다운 옵션들이 모두 표시되는지 확인 (Filter 버튼과 구분하기 위해 getAllByText 사용)
      const latestOptions = screen.getAllByText("최신순");
      expect(latestOptions.length).toBeGreaterThan(0);
      expect(screen.getByText("오래된순")).toBeInTheDocument();
    });

    it("옵션 클릭 시 searchUpdateQuery가 올바른 인자로 호출되고 드롭다운이 닫힙니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      await user.click(filterButton);

      const oldestOption = screen.getByText("오래된순");
      await user.click(oldestOption);

      expect(mockSearchUpdateQuery).toHaveBeenCalledWith("sort", "oldest");
      expect(screen.queryByText("오래된순")).not.toBeInTheDocument();
    });

    it("외부 클릭 시 드롭다운이 닫힙니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      await user.click(filterButton);

      expect(screen.getByText("오래된순")).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      expect(screen.queryByText("오래된순")).not.toBeInTheDocument();
    });

    it("드롭다운 컨테이너 내부의 빈 공간 클릭 시 드롭다운이 닫히지 않습니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      const { container } = render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      await user.click(filterButton);

      expect(screen.getByText("오래된순")).toBeInTheDocument();

      // 컨테이너 내부의 빈 공간 클릭 (옵션 버튼이 아닌 영역)
      const containerDiv = container.querySelector("div");
      if (containerDiv) {
        fireEvent.mouseDown(containerDiv);
        // 컨테이너 내부 클릭이므로 드롭다운이 유지되어야 함
        expect(screen.getByText("오래된순")).toBeInTheDocument();
      }
    });
  });

  describe("Type 필터", () => {
    it("기본 상태에서 분실/발견이 표시됩니다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 발견/분실"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      expect(screen.getByText("발견/분실")).toBeInTheDocument();
    });

    it("type 파라미터가 all일 때 분실/발견이 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("type", "all");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 발견/분실"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 발견/분실");
      expect(filterButton).toHaveTextContent("발견/분실");
    });

    it("type 파라미터가 found일 때 발견 게시물이 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("type", "found");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 발견/분실"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 발견/분실");
      expect(filterButton).toHaveTextContent("발견");
    });

    it("type 파라미터가 lost일 때 분실물이 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("type", "lost");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 발견/분실"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 발견/분실");
      expect(filterButton).toHaveTextContent("분실");
    });

    it("type 파라미터가 found일 때 Filter가 선택된 상태로 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("type", "found");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 분실/발견"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 분실/발견");
      expect(filterButton).toHaveAttribute("aria-selected", "true");
    });

    it("type 파라미터가 all(기본값)일 때 Filter는 비활성으로 표시됩니다", () => {
      const searchParams = new URLSearchParams();
      searchParams.set("type", "all");
      (useSearchParams as jest.Mock).mockReturnValue(searchParams);

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 분실/발견"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 분실/발견");
      expect(filterButton).toHaveAttribute("aria-selected", "false");
    });

    it("type 파라미터가 없을 때 Filter가 선택되지 않은 상태로 표시됩니다", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 분실/발견"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 분실/발견");
      expect(filterButton).toHaveAttribute("aria-selected", "false");
    });

    it("Filter 버튼 클릭 시 모든 옵션이 표시됩니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 분실/발견"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 분실/발견");
      await user.click(filterButton);

      expect(screen.getByText("전체")).toBeInTheDocument();
      expect(screen.getByText("발견")).toBeInTheDocument();
      expect(screen.getByText("분실")).toBeInTheDocument();
    });

    it("옵션 클릭 시 searchUpdateQuery가 올바른 인자로 호출됩니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 분실/발견"
          options={TYPE_OPTIONS}
          keyName="type"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 분실/발견");
      await user.click(filterButton);

      const foundOption = screen.getByText("발견");
      await user.click(foundOption);

      expect(mockSearchUpdateQuery).toHaveBeenCalledWith("type", "found");
    });
  });

  describe("공통 동작", () => {
    it("Filter 버튼을 다시 클릭하면 드롭다운이 닫힙니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      await user.click(filterButton);

      expect(screen.getByText("오래된순")).toBeInTheDocument();

      await user.click(filterButton);

      expect(screen.queryByText("오래된순")).not.toBeInTheDocument();
    });

    it("모든 옵션이 올바르게 렌더링됩니다", async () => {
      const user = userEvent.setup();
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

      render(
        <FilterDropdown
          ariaLabel="채팅 리스트 최신순"
          options={SORT_OPTIONS}
          keyName="sort"
          searchUpdateQuery={mockSearchUpdateQuery}
        />
      );

      const filterButton = screen.getByTestId("filter-채팅 리스트 최신순");
      await user.click(filterButton);

      // 드롭다운 옵션들이 모두 표시되는지 확인 (Filter 버튼과 구분하기 위해 getAllByText 사용)
      SORT_OPTIONS.forEach((option) => {
        const options = screen.getAllByText(option.label);
        expect(options.length).toBeGreaterThan(0);
      });
    });
  });
});
