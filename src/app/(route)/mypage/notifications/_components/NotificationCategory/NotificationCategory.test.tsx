import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotificationCategory from "./NotificationCategory";

const mockMutate = jest.fn();
const mockSetIsBottomSheetOpen = jest.fn();

jest.mock("@/api/fetch/notification/api/usePutNotificationSetting", () => ({
  __esModule: true,
  default: () => ({ mutate: mockMutate, isPending: false }),
}));

jest.mock("@/components/domain", () => ({
  PopupLayout: ({
    isOpen,
    children,
    onClose,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
  }) =>
    isOpen ? (
      <div>
        <button onClick={onClose}>닫기</button>
        {children}
      </div>
    ) : null,
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
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("NotificationCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("isBottomSheetOpen=false이면 렌더되지 않는다", () => {
    render(
      <NotificationCategory
        isBottomSheetOpen={false}
        setIsBottomSheetOpen={mockSetIsBottomSheetOpen}
        categoryOn={[]}
      />
    );
    expect(screen.queryByText("카테고리 키워드")).not.toBeInTheDocument();
  });

  it("isBottomSheetOpen=true이면 7개 카테고리 옵션이 모두 렌더된다", () => {
    render(
      <NotificationCategory
        isBottomSheetOpen={true}
        setIsBottomSheetOpen={mockSetIsBottomSheetOpen}
        categoryOn={[]}
      />
    );
    expect(screen.getByRole("button", { name: "전자기기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "지갑" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "신분증" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "귀금속" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "가방" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "카드" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "기타" })).toBeInTheDocument();
  });

  it("categoryOn으로 전달된 카테고리가 선택된 상태로 렌더된다", () => {
    render(
      <NotificationCategory
        isBottomSheetOpen={true}
        setIsBottomSheetOpen={mockSetIsBottomSheetOpen}
        categoryOn={["ELECTRONICS", "BAG"]}
      />
    );
    expect(screen.getByRole("button", { name: "전자기기" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "가방" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "지갑" })).toHaveAttribute("aria-pressed", "false");
  });

  it("선택되지 않은 카테고리 클릭 시 선택 상태로 토글된다", () => {
    render(
      <NotificationCategory
        isBottomSheetOpen={true}
        setIsBottomSheetOpen={mockSetIsBottomSheetOpen}
        categoryOn={[]}
      />
    );
    const walletBtn = screen.getByRole("button", { name: "지갑" });
    fireEvent.click(walletBtn);
    expect(walletBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("'적용하기' 클릭 시 mutate가 현재 선택된 카테고리로 호출되고 바텀시트가 닫힌다", () => {
    render(
      <NotificationCategory
        isBottomSheetOpen={true}
        setIsBottomSheetOpen={mockSetIsBottomSheetOpen}
        categoryOn={["ELECTRONICS"]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "적용하기" }));
    expect(mockMutate).toHaveBeenCalledWith({ enabledCategories: ["ELECTRONICS"] });
    expect(mockSetIsBottomSheetOpen).toHaveBeenCalledWith(false);
  });
});
