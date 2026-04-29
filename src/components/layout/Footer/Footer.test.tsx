import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import useFooterNav from "./_hooks/useFooterNav";

jest.mock("./_hooks/useFooterNav");

jest.mock("@/store", () => ({
  useNotificationStore: () => ({
    hasUnreadNotification: false,
    unreadNotificationTypes: [],
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, onClick, ...rest }: any) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  const homeItem = {
    key: "/",
    link: { name: "홈", href: "/", icon: "Home" as const, requiresLogin: false },
    href: "/",
    isActive: undefined as string | undefined,
    isLoginRequiredDisabled: false,
    showLoginRequiredNotice: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("isHidden이 true이면 렌더하지 않습니다", () => {
    (useFooterNav as jest.Mock).mockReturnValue({ isHidden: true, items: [] });
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeNull();
  });

  it("isHidden이 false이면 내비게이션과 항목 라벨을 렌더합니다", () => {
    (useFooterNav as jest.Mock).mockReturnValue({
      isHidden: false,
      items: [homeItem],
    });
    render(<Footer />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("홈")).toBeInTheDocument();
  });

  it("자리 표시용 숨김 영역이 함께 렌더됩니다", () => {
    (useFooterNav as jest.Mock).mockReturnValue({
      isHidden: false,
      items: [homeItem],
    });
    const { container } = render(<Footer />);
    const spacers = container.querySelectorAll("[aria-hidden='true']");
    expect(spacers.length).toBeGreaterThanOrEqual(1);
  });
});
