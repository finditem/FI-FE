import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import KakaoLoading from "./KakaoLoading";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
}));

describe("<KakaoLoading />", () => {
  it("'로그인 요청 중...' 텍스트가 렌더된다", () => {
    render(<KakaoLoading />);
    expect(screen.getByText("로그인 요청 중...")).toBeInTheDocument();
  });

  it("Loading 아이콘이 렌더된다", () => {
    render(<KakaoLoading />);
    expect(screen.getByTestId("icon-Loading")).toBeInTheDocument();
  });
});
