import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SupportTab from "./SupportTab";
import type { SupportTabKey } from "./_internal/SUPPORT_TABS";

type UseSupportTabQueryResult = {
  tab: SupportTabKey;
  updateTabQuery: jest.Mock;
};

const mockUpdateTabQuery = jest.fn();

const mockUseSupportTabQuery = jest.fn(
  (): UseSupportTabQueryResult => ({
    tab: "all",
    updateTabQuery: mockUpdateTabQuery,
  })
);

jest.mock("./_internal/useSupportTabQuery", () => ({
  useSupportTabQuery: () => mockUseSupportTabQuery(),
}));

describe("SupportTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTabQuery.mockClear();
    mockUseSupportTabQuery.mockImplementation(() => ({
      tab: "all",
      updateTabQuery: mockUpdateTabQuery,
    }));
  });

  it("탭 레이블이 모두 렌더된다", () => {
    render(<SupportTab />);
    expect(screen.getByRole("button", { name: "전체" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "계정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이용 방법" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "기타" })).toBeInTheDocument();
  });

  it("현재 탭 버튼에 선택 스타일 클래스가 적용된다", () => {
    mockUseSupportTabQuery.mockImplementation(() => ({
      tab: "account",
      updateTabQuery: mockUpdateTabQuery,
    }));
    render(<SupportTab />);
    expect(screen.getByRole("button", { name: "계정" })).toHaveClass(
      "border-b-2",
      "border-brand-normal-default",
      "text-brand-normal-default"
    );
    expect(screen.getByRole("button", { name: "전체" })).toHaveClass("text-system-unselected");
    expect(screen.getByRole("button", { name: "전체" })).not.toHaveClass(
      "border-brand-normal-default"
    );
  });

  it("탭 클릭 시 updateTabQuery에 해당 키가 전달된다", async () => {
    const user = userEvent.setup();
    render(<SupportTab />);
    await user.click(screen.getByRole("button", { name: "이용 방법" }));
    expect(mockUpdateTabQuery).toHaveBeenCalledWith("usage");

    await user.click(screen.getByRole("button", { name: "기타" }));
    expect(mockUpdateTabQuery).toHaveBeenCalledWith("etc");
  });
});
