import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MapLoadingState, MapErrorState } from "./MapState";

jest.mock("@/components/common", () => ({
  Icon: ({ name, className }: any) => <svg data-testid={`icon-${name}`} className={className} />,
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("<MapLoadingState />", () => {
  it("로고 아이콘을 렌더링합니다.", () => {
    render(<MapLoadingState />);
    expect(screen.getByTestId("icon-LogoCharacterOutlined")).toBeInTheDocument();
  });

  it("로딩 중 텍스트를 렌더링합니다.", () => {
    render(<MapLoadingState />);
    expect(screen.getByText("페이지 로딩 중입니다.")).toBeInTheDocument();
  });

  it("로딩 아이콘에 animate-spin 클래스가 적용됩니다.", () => {
    render(<MapLoadingState />);
    expect(screen.getByTestId("icon-Loading")).toHaveClass("animate-spin");
  });
});

describe("<MapErrorState />", () => {
  it("에러 아이콘을 렌더링합니다.", () => {
    render(<MapErrorState />);
    expect(screen.getByTestId("icon-AlertState")).toBeInTheDocument();
  });

  it("에러 제목을 렌더링합니다.", () => {
    render(<MapErrorState />);
    expect(screen.getByText("지도를 표시할 수 없습니다.")).toBeInTheDocument();
  });

  it("에러 안내 메시지를 렌더링합니다.", () => {
    render(<MapErrorState />);
    expect(screen.getByText(/일시적인 서비스 오류가 발생했습니다/)).toBeInTheDocument();
  });
});
