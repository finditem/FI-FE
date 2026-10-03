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

const mutateLater = jest.fn();
const mutateReview = jest.fn();

jest.mock("@/api/fetch/post", () => ({
  usePutPostStatus: (_postId: number, _isFound: boolean, options?: { silent?: boolean }) => ({
    mutate: options?.silent ? mutateReview : mutateLater,
  }),
}));

describe("PostFoundConfirmModal", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("후기 남기기 클릭 시 상태 변경 요청을 보내지만, 응답이 오기 전에는 모달을 닫거나 이동하지 않습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} roomId={10} onClose={onClose} />);

    await user.click(screen.getByText("후기 남기기"));

    expect(mutateReview).toHaveBeenCalledWith({ postStatus: "FOUND" }, expect.any(Object));
    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("후기 남기기 요청이 성공하면 모달을 닫고 후기 작성 페이지로 이동합니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} roomId={10} onClose={onClose} />);

    await user.click(screen.getByText("후기 남기기"));
    const { onSuccess } = mutateReview.mock.calls[0][1];
    onSuccess();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/write/review/10");
  });

  it("roomId가 없으면 요청이 성공해도 후기 작성 페이지로 이동하지 않습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} onClose={onClose} />);

    await user.click(screen.getByText("후기 남기기"));
    const { onSuccess } = mutateReview.mock.calls[0][1];
    onSuccess();

    expect(mockPush).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("나중에 클릭 시 상태 변경 요청을 보내고 즉시 모달을 닫습니다", async () => {
    const user = userEvent.setup();
    render(<PostFoundConfirmModal isOpen postId={1} roomId={10} onClose={onClose} />);

    await user.click(screen.getByText("나중에"));

    expect(mutateLater).toHaveBeenCalledWith({ postStatus: "FOUND" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
