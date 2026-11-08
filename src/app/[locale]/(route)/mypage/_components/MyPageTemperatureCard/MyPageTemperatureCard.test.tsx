import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyPageTemperatureCard from "./MyPageTemperatureCard";

jest.mock("@/components", () => ({
  Icon: () => <span />,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  PopupLayout: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
    isOpen ? <div role="dialog">{children}</div> : null,
}));

describe("MyPageTemperatureCard", () => {
  it.each([
    [31.2, "따뜻한 발걸음으로 다시 온도를 올려봐요"],
    [36.5, "첫 습득물을 등록하고 온도를 올려보세요"],
    [46.5, "이웃의 물건을 찾아주기 시작했어요"],
    [67.5, "잘 찾아주고, 잘 돌려주는 이웃이에요"],
    [84, "믿고 찾을 수 있는 이웃이에요"],
    [99, "최고 온도에 도달했어요"],
  ])("%s도이면 구간 문구를 렌더한다", (temperature, message) => {
    render(<MyPageTemperatureCard temperature={temperature} />);
    expect(screen.getByText(temperature.toFixed(1))).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("36.5도 미만이면 온도 수치를 회색으로 표시한다", () => {
    render(<MyPageTemperatureCard temperature={31.2} />);
    expect(screen.getByText("31.2")).toHaveClass("text-layout-body-default");
  });

  it("36.5도 이상이면 온도 수치를 브랜드 색으로 표시한다", () => {
    render(<MyPageTemperatureCard temperature={46.5} />);
    expect(screen.getByText("46.5")).toHaveClass("text-brand-strongUseThis-default");
  });

  it("온도가 없으면 카드 틀은 유지하고 수치와 문구를 숨긴다", () => {
    render(<MyPageTemperatureCard />);
    expect(screen.getByText("찾길 온도")).toBeInTheDocument();
    expect(screen.getByText("첫 온도 36.5℃")).toBeInTheDocument();
    expect(screen.getByText("36.5").closest(".invisible")).not.toBeNull();
    expect(
      screen.getByText("첫 습득물을 등록하고 온도를 올려보세요").closest(".invisible")
    ).not.toBeNull();
  });

  it("온도가 있으면 수치와 문구를 숨기지 않는다", () => {
    render(<MyPageTemperatureCard temperature={46.5} />);
    expect(screen.getByText("46.5").closest(".invisible")).toBeNull();
    expect(screen.getByText("이웃의 물건을 찾아주기 시작했어요").closest(".invisible")).toBeNull();
  });

  it("첫 온도 표시를 렌더한다", () => {
    render(<MyPageTemperatureCard temperature={46.5} />);
    expect(screen.getByText("첫 온도 36.5℃")).toBeInTheDocument();
  });

  it("정보 버튼을 누르면 온도 설명 바텀시트가 열리고 확인으로 닫힌다", () => {
    render(<MyPageTemperatureCard temperature={36.5} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "찾길 온도 설명 보기" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("반환 완료")).toBeInTheDocument();
    expect(screen.getByText("+2.0℃")).toBeInTheDocument();
    expect(screen.getByText("-1.0℃")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
