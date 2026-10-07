import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tab from "./Tab";

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("<Tab />", () => {
  const tabs = [
    { key: "tab1", label: "Tab 1" },
    { key: "tab2", label: "Tab 2" },
    { key: "tab3", label: "Tab 3" },
  ] as const;

  it("모든 탭 레이블을 렌더링합니다.", () => {
    render(<Tab tabs={tabs} selected="tab1" onValueChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tab 3" })).toBeInTheDocument();
  });

  it("선택된 탭에만 선택 스타일과 밑줄을 적용합니다.", () => {
    render(<Tab tabs={tabs} selected="tab2" onValueChange={jest.fn()} />);

    const btn1 = screen.getByRole("button", { name: "Tab 1" });
    const btn2 = screen.getByRole("button", { name: "Tab 2" });
    const btn3 = screen.getByRole("button", { name: "Tab 3" });

    [btn1, btn2, btn3].forEach((el) => {
      expect(el).toHaveClass("h-[60px]");
      expect(el).toHaveClass("flex-1");
      expect(el).toHaveClass("text-h3-semibold");
      expect(el).toHaveClass("text-system-unselected");
      expect(el).toHaveClass("flex-center");
    });

    expect(btn2.className).toContain("text-flatGreen-500");
    expect(btn1.className).not.toContain("text-flatGreen-500");
    expect(btn3.className).not.toContain("text-flatGreen-500");

    // 밑줄(motion.span)은 선택된 탭 버튼 안에만 렌더된다.
    expect(btn2.querySelector("span")).not.toBeNull();
    expect(btn1.querySelector("span")).toBeNull();
    expect(btn3.querySelector("span")).toBeNull();
  });

  it("선택 탭이 바뀌면 밑줄이 새 탭으로 옮겨갑니다.", () => {
    const { rerender } = render(<Tab tabs={tabs} selected="tab1" onValueChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Tab 1" }).querySelector("span")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Tab 3" }).querySelector("span")).toBeNull();

    rerender(<Tab tabs={tabs} selected="tab3" onValueChange={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Tab 1" }).querySelector("span")).toBeNull();
    expect(screen.getByRole("button", { name: "Tab 3" }).querySelector("span")).not.toBeNull();
  });

  it("탭 클릭 시 onValueChange를 해당 key로 호출합니다.", () => {
    const onValueChange = jest.fn();
    render(<Tab tabs={tabs} selected="tab1" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Tab 3" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("tab3");

    fireEvent.click(screen.getByRole("button", { name: "Tab 1" }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenCalledWith("tab1");
  });

  it("이미 선택된 탭 클릭도 onValueChange를 호출합니다. (현재 구현 기준)", () => {
    const onValueChange = jest.fn();
    render(<Tab tabs={tabs} selected="tab1" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Tab 1" }));
    expect(onValueChange).toHaveBeenCalledWith("tab1");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});
