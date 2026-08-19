import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AppleLoading from "./AppleLoading";

jest.mock("@/components/common", () => ({
  Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
}));

describe("<AppleLoading />", () => {
  it("'로그인 요청 중...' 텍스트가 렌더된다", () => {
    render(<AppleLoading />);
    expect(screen.getByText("로그인 요청 중...")).toBeInTheDocument();
  });

  it("Loading 아이콘이 렌더된다", () => {
    render(<AppleLoading />);
    expect(screen.getByTestId("icon-Loading")).toBeInTheDocument();
  });
});
