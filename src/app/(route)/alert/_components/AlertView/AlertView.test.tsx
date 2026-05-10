import type { Dispatch, SetStateAction } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import useNotificationDelete from "@/api/fetch/notification/api/useNotificationDelete";
import { useNotificationDeleteAll } from "@/api/fetch/notification";
import AlertView from "./AlertView";

const mockMutateDelete = jest.fn();
const mockMutateDeleteAll = jest.fn();

jest.mock("@/api/fetch/notification/api/useNotificationDelete", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/api/fetch/notification", () => ({
  ...jest.requireActual<typeof import("@/api/fetch/notification")>("@/api/fetch/notification"),
  useNotificationDeleteAll: jest.fn(),
}));

jest.mock("./_internal", () => ({
  AlertList: ({
    setSelectedNotifications,
  }: {
    setSelectedNotifications: Dispatch<SetStateAction<number[]>>;
  }) => (
    <button
      type="button"
      data-testid="mock-add-selection"
      onClick={() => setSelectedNotifications([10, 20])}
    >
      선택 추가
    </button>
  ),
  AlertDeleteSection: ({
    isDeleteMode,
    disabled,
    setIsDeleteModalOpen,
    setDeleteTarget,
  }: {
    isDeleteMode: boolean;
    disabled: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    setDeleteTarget: (target: "selected" | "all") => void;
  }) =>
    !isDeleteMode ? null : (
      <div data-testid="delete-section">
        <button
          type="button"
          data-testid="btn-selected-delete"
          disabled={disabled}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          선택 삭제
        </button>
        <button
          type="button"
          data-testid="btn-all-delete"
          onClick={() => {
            setDeleteTarget("all");
            setIsDeleteModalOpen(true);
          }}
        >
          전체 삭제
        </button>
      </div>
    ),
  AlertDeleteModal: ({
    isOpen,
    disabled,
    onConfirm,
    onCancel,
  }: {
    isOpen: boolean;
    disabled: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button type="button" data-testid="modal-confirm" disabled={disabled} onClick={onConfirm}>
          삭제하기
        </button>
        <button type="button" data-testid="modal-cancel" onClick={onCancel}>
          아니요
        </button>
      </div>
    ) : null,
}));

const mockUseNotificationDelete = jest.mocked(useNotificationDelete);
const mockUseNotificationDeleteAll = jest.mocked(useNotificationDeleteAll);

describe("AlertView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotificationDelete.mockReturnValue({
      mutate: mockMutateDelete,
      isPending: false,
    } as unknown as ReturnType<typeof useNotificationDelete>);
    mockUseNotificationDeleteAll.mockReturnValue({
      mutate: mockMutateDeleteAll,
      isPending: false,
    } as unknown as ReturnType<typeof useNotificationDeleteAll>);
  });

  it("삭제 모드가 아니면 하단 삭제 영역을 렌더하지 않는다", () => {
    render(<AlertView isDeleteMode={false} setIsDeleteMode={jest.fn()} />);

    expect(screen.queryByTestId("delete-section")).not.toBeInTheDocument();
  });

  it("삭제 모드이고 선택이 없으면 선택 삭제 버튼이 비활성화된다", () => {
    render(<AlertView isDeleteMode setIsDeleteMode={jest.fn()} />);

    expect(screen.getByTestId("btn-selected-delete")).toBeDisabled();
  });

  it("선택 추가 후 선택 삭제 확인 시 deleteNotifications를 호출하고 삭제 모드를 끈다", async () => {
    const user = userEvent.setup();
    const setIsDeleteMode = jest.fn();

    render(<AlertView isDeleteMode setIsDeleteMode={setIsDeleteMode} />);

    await user.click(screen.getByTestId("mock-add-selection"));
    await user.click(screen.getByTestId("btn-selected-delete"));
    await user.click(screen.getByTestId("modal-confirm"));

    expect(mockMutateDelete).toHaveBeenCalledWith({ ids: [10, 20] });
    expect(mockMutateDeleteAll).not.toHaveBeenCalled();
    expect(setIsDeleteMode).toHaveBeenCalledWith(false);
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  it("전체 삭제 확인 시 deleteAllNotifications를 호출하고 삭제 모드를 끈다", async () => {
    const user = userEvent.setup();
    const setIsDeleteMode = jest.fn();

    render(<AlertView isDeleteMode setIsDeleteMode={setIsDeleteMode} />);

    await user.click(screen.getByTestId("btn-all-delete"));
    await user.click(screen.getByTestId("modal-confirm"));

    expect(mockMutateDeleteAll).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    );
    expect(mockMutateDelete).not.toHaveBeenCalled();
    expect(setIsDeleteMode).toHaveBeenCalledWith(false);
  });

  it("모달 취소 시 모달만 닫히고 mutate는 호출되지 않는다", async () => {
    const user = userEvent.setup();

    render(<AlertView isDeleteMode setIsDeleteMode={jest.fn()} />);

    await user.click(screen.getByTestId("btn-all-delete"));
    await user.click(screen.getByTestId("modal-cancel"));

    expect(mockMutateDelete).not.toHaveBeenCalled();
    expect(mockMutateDeleteAll).not.toHaveBeenCalled();
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  it("삭제 요청 대기 중에는 모달 확인 버튼이 비활성화된다", async () => {
    const user = userEvent.setup();
    mockUseNotificationDeleteAll.mockReturnValue({
      mutate: mockMutateDeleteAll,
      isPending: true,
    } as unknown as ReturnType<typeof useNotificationDeleteAll>);

    render(<AlertView isDeleteMode setIsDeleteMode={jest.fn()} />);

    await user.click(screen.getByTestId("btn-all-delete"));

    expect(screen.getByTestId("modal-confirm")).toBeDisabled();
  });
});
