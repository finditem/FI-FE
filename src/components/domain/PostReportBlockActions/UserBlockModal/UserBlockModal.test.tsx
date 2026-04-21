import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import UserBlockModal from "./UserBlockModal";

const mockBlockUser = jest.fn();

jest.mock("@/api/fetch/report", () => ({
  useBlock: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/common/Modal/_internal/ModalLayout", () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div role="dialog">{children}</div> : null),
}));

const { useBlock } = jest.requireMock("@/api/fetch/report");

describe("<UserBlockModal />", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    useBlock.mockReturnValue({ mutate: mockBlockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("isOpen이 true이면 모달을 렌더링합니다.", () => {
    render(<UserBlockModal isOpen={true} onClose={onClose} writerId={1} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("isOpen이 false이면 모달을 렌더링하지 않습니다.", () => {
    render(<UserBlockModal isOpen={false} onClose={onClose} writerId={1} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("차단 확인 메시지를 렌더링합니다.", () => {
    render(<UserBlockModal isOpen={true} onClose={onClose} writerId={1} />);
    expect(screen.getByText("해당 유저를 차단하시겠습니까?")).toBeInTheDocument();
  });

  it("차단 안내 문구를 렌더링합니다.", () => {
    render(<UserBlockModal isOpen={true} onClose={onClose} writerId={1} />);
    expect(
      screen.getByText("차단한 유저의 게시글과 댓글을 볼 수 없게 됩니다.")
    ).toBeInTheDocument();
  });

  it("취소 버튼 클릭 시 onClose가 호출됩니다.", async () => {
    render(<UserBlockModal isOpen={true} onClose={onClose} writerId={1} />);
    await userEvent.click(screen.getByText("취소"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("차단하기 버튼 클릭 시 blockUser가 호출됩니다.", async () => {
    render(<UserBlockModal isOpen={true} onClose={onClose} writerId={1} />);
    await userEvent.click(screen.getByText("차단하기"));
    expect(mockBlockUser).toHaveBeenCalledTimes(1);
  });

  it("useBlock에 writerId와 onClose가 전달됩니다.", () => {
    render(<UserBlockModal isOpen={true} onClose={onClose} writerId={42} />);
    expect(useBlock).toHaveBeenCalledWith({ onClose, userId: 42 });
  });
});
