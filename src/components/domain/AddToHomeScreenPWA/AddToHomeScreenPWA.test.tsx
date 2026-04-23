import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddToHomeScreenPWA from "./AddToHomeScreenPWA";

jest.mock("@/hooks", () => ({
  useAddToHomeScreen: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Icon: ({ name }: any) => <svg data-testid={`icon-${name}`} />,
}));

jest.mock("../PopupLayout/PopupLayout", () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
}));

const { useAddToHomeScreen } = jest.requireMock("@/hooks");
const mockInstallApp = jest.fn();

describe("<AddToHomeScreenPWA />", () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("canInstall이 false이면 null을 렌더링합니다.", () => {
    useAddToHomeScreen.mockReturnValue({ installApp: mockInstallApp, canInstall: false });
    const { container } = render(<AddToHomeScreenPWA isOpen={true} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it("canInstall이 true이고 isOpen이 true이면 팝업을 렌더링합니다.", () => {
    useAddToHomeScreen.mockReturnValue({ installApp: mockInstallApp, canInstall: true });
    render(<AddToHomeScreenPWA isOpen={true} onClose={onClose} />);
    expect(screen.getByText("홈 화면에 추가하기")).toBeInTheDocument();
  });

  it("isOpen이 false이면 팝업이 표시되지 않습니다.", () => {
    useAddToHomeScreen.mockReturnValue({ installApp: mockInstallApp, canInstall: true });
    render(<AddToHomeScreenPWA isOpen={false} onClose={onClose} />);
    expect(screen.queryByText("홈 화면에 추가하기")).not.toBeInTheDocument();
  });

  it("'홈 화면에 추가하기' 버튼 클릭 시 installApp을 호출하고 onClose를 호출합니다.", async () => {
    useAddToHomeScreen.mockReturnValue({ installApp: mockInstallApp, canInstall: true });
    render(<AddToHomeScreenPWA isOpen={true} onClose={onClose} />);
    await userEvent.click(screen.getByText("홈 화면에 추가하기"));
    expect(mockInstallApp).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("'다음에 할래요' 버튼 클릭 시 onClose를 호출합니다.", async () => {
    useAddToHomeScreen.mockReturnValue({ installApp: mockInstallApp, canInstall: true });
    render(<AddToHomeScreenPWA isOpen={true} onClose={onClose} />);
    await userEvent.click(screen.getByText("다음에 할래요"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Logo 아이콘을 렌더링합니다.", () => {
    useAddToHomeScreen.mockReturnValue({ installApp: mockInstallApp, canInstall: true });
    render(<AddToHomeScreenPWA isOpen={true} onClose={onClose} />);
    expect(screen.getByTestId("icon-Logo")).toBeInTheDocument();
  });
});
