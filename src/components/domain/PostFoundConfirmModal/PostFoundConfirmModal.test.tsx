import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PostFoundConfirmModal from "./PostFoundConfirmModal";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/components/common/Modal/_internal/ModalLayout", () => ({
  __esModule: true,
  default: ({ isOpen, children }: any) => (isOpen ? <div role="dialog">{children}</div> : null),
}));

jest.mock("@/components/common", () => ({
  Icon: () => null,
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

// roomId가 없는 경로(게시글 상세)에서만 쓰이는 게시글 상태 변경 mutation.
const mutatePutStatus = jest.fn();
jest.mock("@/api/fetch/post", () => ({
  usePutPostStatus: () => ({ mutate: mutatePutStatus, isPending: false }),
}));

// roomId가 있는 경로(채팅 상세)에서 쓰이는 찾기 완료 mutation. silent 여부로 두 인스턴스를 구분한다.
const mutateCompleteLater = jest.fn();
const mutateCompleteReview = jest.fn();
jest.mock("@/api/fetch/chatRoom/api/usePostFindCompletion", () => ({
  __esModule: true,
  default: (_roomId: number, _postId: number, options?: { silent?: boolean }) => ({
    mutate: options?.silent ? mutateCompleteReview : mutateCompleteLater,
    isPending: false,
  }),
}));

describe("PostFoundConfirmModal", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("roomId가 있으면 후기 남기기 클릭 시 찾기 완료 요청을 보내지만, 응답이 오기 전에는 모달을 닫거나 이동하지 않습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} roomId={10} onClose={onClose} />);

    await user.click(screen.getByText("후기 남기기"));

    expect(mutateCompleteReview).toHaveBeenCalledWith(undefined, expect.any(Object));
    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("찾기 완료 요청이 성공하면 모달을 닫고 후기 작성 페이지로 이동합니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} roomId={10} onClose={onClose} />);

    await user.click(screen.getByText("후기 남기기"));
    const { onSuccess } = mutateCompleteReview.mock.calls[0][1];
    onSuccess();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/write/review/10");
  });

  it("roomId가 없으면 후기 남기기 시 게시글 상태만 변경하고 후기 작성 페이지로 이동하지 않습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} onClose={onClose} />);

    await user.click(screen.getByText("후기 남기기"));

    expect(mutatePutStatus).toHaveBeenCalledWith({ postStatus: "FOUND" });
    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("roomId가 있으면 나중에 클릭 시 찾기 완료 요청을 보내고 성공 시 모달을 닫습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} roomId={10} onClose={onClose} />);

    await user.click(screen.getByText("나중에"));

    expect(mutateCompleteLater).toHaveBeenCalledWith(undefined, expect.any(Object));
    expect(onClose).not.toHaveBeenCalled();

    const { onSuccess } = mutateCompleteLater.mock.calls[0][1];
    onSuccess();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("roomId가 없으면 나중에 클릭 시 게시글 상태를 변경하고 즉시 모달을 닫습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} onClose={onClose} />);

    await user.click(screen.getByText("나중에"));

    expect(mutatePutStatus).toHaveBeenCalledWith({ postStatus: "FOUND" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
