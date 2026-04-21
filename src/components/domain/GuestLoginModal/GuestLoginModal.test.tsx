import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import GuestLoginModal from "./GuestLoginModal";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, onClick, variant, as: Component, href }: any) => {
    if (Component) {
      return <Component href={href}>{children}</Component>;
    }
    return (
      <button data-variant={variant} onClick={onClick}>
        {children}
      </button>
    );
  },
}));

jest.mock("@/components/common/Modal/_internal/ModalLayout", () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div role="dialog">{children}</div> : null),
}));

describe("<GuestLoginModal />", () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("isOpen이 true이면 모달을 렌더링합니다.", () => {
    render(<GuestLoginModal isOpen={true} onClose={onClose} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("isOpen이 false이면 모달을 렌더링하지 않습니다.", () => {
    render(<GuestLoginModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("안내 제목을 렌더링합니다.", () => {
    render(<GuestLoginModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText("회원만 댓글을 작성할 수 있어요.")).toBeInTheDocument();
  });

  it("안내 설명을 렌더링합니다.", () => {
    render(<GuestLoginModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText("로그인하고 의견을 남겨보세요.")).toBeInTheDocument();
  });

  it("취소 버튼 클릭 시 onClose가 호출됩니다.", async () => {
    render(<GuestLoginModal isOpen={true} onClose={onClose} />);
    await userEvent.click(screen.getByText("취소"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("로그인 링크가 /login으로 연결됩니다.", () => {
    render(<GuestLoginModal isOpen={true} onClose={onClose} />);
    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "/login");
  });
});
