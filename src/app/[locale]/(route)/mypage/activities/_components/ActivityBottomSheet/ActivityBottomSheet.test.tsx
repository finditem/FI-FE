import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityBottomSheet from "./ActivityBottomSheet";
import { ACTIVITY_DEFAULT_FILTERS } from "../../_types/ActivityFilterType";

const mockRouterReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/mypage/activities",
}));

jest.mock("@/utils/applyFiltersToUrl/applyFiltersToUrl", () => ({
  applyFiltersToUrl: jest.fn(() => ""),
}));

jest.mock("@/components/domain", () => ({
  PopupLayout: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
  }) => (isOpen ? <div>{children}</div> : null),
}));

jest.mock("@/components/common", () => ({
  Filter: ({
    children,
    onClick,
    onSelected,
    ariaLabel,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    onSelected: boolean;
    ariaLabel: string;
  }) => (
    <button onClick={onClick} aria-pressed={onSelected} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const ACTIVITY_OPTIONS = [
  { value: undefined, label: "전체" },
  { value: "POST", label: "게시글" },
  { value: "COMMENT", label: "댓글" },
] as const;

describe("ActivityBottomSheet", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "활동 유형",
    option: ACTIVITY_OPTIONS,
    filters: ACTIVITY_DEFAULT_FILTERS,
    setFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("isOpen=false이면 렌더되지 않는다", () => {
    render(<ActivityBottomSheet {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("활동 유형")).not.toBeInTheDocument();
  });

  it("isOpen=true이면 title과 옵션들이 렌더된다", () => {
    render(<ActivityBottomSheet {...defaultProps} />);
    expect(screen.getByText("활동 유형")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "게시글" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "댓글" })).toBeInTheDocument();
  });

  it("현재 filters.activity와 일치하는 옵션이 선택 상태로 표시된다", () => {
    render(
      <ActivityBottomSheet
        {...defaultProps}
        filters={{ ...ACTIVITY_DEFAULT_FILTERS, activity: "POST" }}
      />
    );
    expect(screen.getByRole("button", { name: "게시글" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute("aria-pressed", "false");
  });

  it("옵션 클릭 시 setFilters가 호출된다", () => {
    const setFilters = jest.fn();
    render(<ActivityBottomSheet {...defaultProps} setFilters={setFilters} />);
    fireEvent.click(screen.getByRole("button", { name: "게시글" }));
    expect(setFilters).toHaveBeenCalled();
  });

  it("'적용하기' 클릭 시 onClose와 router.replace가 호출된다", () => {
    const onClose = jest.fn();
    render(<ActivityBottomSheet {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "적용하기" }));
    expect(onClose).toHaveBeenCalled();
    expect(mockRouterReplace).toHaveBeenCalled();
  });
});
