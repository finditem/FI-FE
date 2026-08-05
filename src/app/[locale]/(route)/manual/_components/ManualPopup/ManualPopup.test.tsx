import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManualPopup from "./ManualPopup";

jest.mock("@/components/common", () => ({
  __esModule: true,
  Icon: ({ name, ...rest }: any) => <span data-testid={`icon-${name}`} {...rest} />,
  PopupLayout: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
  Button: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("ManualPopup", () => {
  const titleText = /분실물이 있나요\?\s*매뉴얼을 보면 더 도움이 돼요!/;
  const descText = /분실물 발생 시 도움이 되는 정보/i;
  const primaryBtn = "매뉴얼 보러가기";
  const secondaryBtn = "다음에 볼게요";

  it("isOpen=true일 때 콘텐츠가 렌더링됩니다.", () => {
    render(<ManualPopup isOpen onClose={jest.fn()} />);

    // 제목/설명
    expect(screen.getByRole("heading", { level: 1, name: titleText })).toBeInTheDocument();
    expect(screen.getByText(descText)).toBeInTheDocument();

    // 버튼들
    expect(screen.getByRole("button", { name: primaryBtn })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: secondaryBtn })).toBeInTheDocument();

    // 아이콘
    expect(screen.getByTestId("icon-Book")).toBeInTheDocument();
  });

  it("isOpen=false일 때 렌더링되지 않습니다.", () => {
    render(<ManualPopup isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByRole("heading", { level: 1, name: titleText })).toBeNull();
    expect(screen.queryByText(descText)).toBeNull();
    expect(screen.queryByRole("button", { name: primaryBtn })).toBeNull();
    expect(screen.queryByTestId("icon-Book")).toBeNull();
  });

  it("‘다음에 볼게요’ 클릭 시 onClose가 호출됩니다.", () => {
    const onClose = jest.fn();
    render(<ManualPopup isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: secondaryBtn }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
