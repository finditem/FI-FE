import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ChatRoomHeaderInfoButton from "./ChatRoomHeaderInfoButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Providers });
};

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack, replace: mockReplace }),
}));

const mockMutate = jest.fn();
let onSuccessCallback: (() => void) | undefined;

jest.mock("@/api/_base/query/useAppMutation", () => {
  return jest.fn((apiType: string, url: string, method: string, options?: any) => {
    onSuccessCallback = options?.onSuccess;
    return {
      mutate: (variables?: any, mutationOptions?: any) => {
        mockMutate(variables, mutationOptions);
        // mutate 호출 시 onSuccess 실행
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      },
    };
  });
});

jest.mock("@/api/fetch/report/api/useReport", () => {
  return jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  }));
});

jest.mock("@/components/common", () => ({
  Icon: ({ name, ...rest }: any) => <span data-testid={`icon-${name}`} {...rest} />,
  RequiredText: () => <span>*</span>,
  Toast: ({ message }: any) => <div data-testid="toast">{message}</div>,
  Button: ({ children, onClick, ...rest }: any) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  InputField: ({ name, label, placeholder, ...rest }: any) => (
    <div>
      {label && <label>{label}</label>}
      <textarea name={name} placeholder={placeholder} {...rest} />
    </div>
  ),
  ConfirmModal: ({ isOpen, onConfirm, onCancel, title, content }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="confirm-modal">
        <div>{title}</div>
        <div>{content}</div>
        <button onClick={onConfirm} data-testid="modal-confirm">
          확인
        </button>
        <button onClick={onCancel} data-testid="modal-cancel">
          취소
        </button>
      </div>
    );
  },
  ModalLayout: ({ isOpen, children, dialogTestId }: any) =>
    isOpen ? <div data-testid={dialogTestId}>{children}</div> : null,
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

jest.mock("@/components/layout", () => ({
  DetailHeader: ({ title, onBack, children }: any) => (
    <header>
      <button onClick={onBack}>뒤로가기</button>
      {title && <h2>{title}</h2>}
      {children}
    </header>
  ),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useModalBackdrop: () => () => {},
  useModalLockAndEsc: () => {},
}));

jest.mock("@/components/domain/ReportModal/_internal", () => ({
  ReportPopupLayout: ({ isOpen, children }: any) => (isOpen ? <div>{children}</div> : null),
  ReportSelectBox: () => <div>ReportSelectBox</div>,
  ReportReasonModal: () => null,
}));

jest.mock("@/components/domain", () => ({
  ReportModal: ({ isOpen }: any) =>
    isOpen ? <div data-testid="report-modal">Report Modal</div> : null,
}));

describe("ChatRoomHeaderInfoButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    onSuccessCallback = undefined;
  });

  it("정보 버튼이 렌더링됩니다", () => {
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    expect(infoButton).toBeInTheDocument();
    expect(screen.getByTestId("icon-Information")).toBeInTheDocument();
  });

  it("정보 버튼 클릭 시 메뉴가 열립니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "차단, 신고하기" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "채팅방 나가기" })).toBeInTheDocument();
  });

  it("메뉴 옵션들이 올바르게 렌더링됩니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    expect(screen.getByText("차단, 신고하기")).toBeInTheDocument();
    expect(screen.getByText("채팅방 나가기")).toBeInTheDocument();
  });

  it("차단, 신고하기 클릭 시 Report 컴포넌트가 열립니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    const reportButton = screen.getByRole("button", { name: "차단, 신고하기" });
    await user.click(reportButton);

    expect(screen.getByTestId("report-modal")).toBeInTheDocument();
  });

  it("채팅방 나가기 클릭 시 모달이 열립니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    const leaveButton = screen.getByRole("button", { name: "채팅방 나가기" });
    await user.click(leaveButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByText("채팅방을 나가시겠어요?")).toBeInTheDocument();
    expect(
      screen.getByText(
        /채팅방을 나가면 채팅 목록 및 대화 내용이 삭제되고\s+복구할 수 없어요\. 채팅방에서 나가시겠어요\?/
      )
    ).toBeInTheDocument();
  });

  it("모달에서 확인 클릭 시 router.replace가 호출됩니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    // 메뉴 열기
    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    // 채팅방 나가기 클릭하여 모달 열기
    const leaveButton = screen.getByRole("button", { name: "채팅방 나가기" });
    await user.click(leaveButton);

    // 모달에서 확인 클릭
    const confirmButton = screen.getByTestId("modal-confirm");
    await user.click(confirmButton);

    // mutate가 호출되어야 하고, onSuccess에서 router.replace가 호출됨
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/chat");
  });

  it("모달에서 취소 클릭 시 모달이 닫힙니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    // 메뉴 열기
    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    // 채팅방 나가기 클릭하여 모달 열기
    const leaveButton = screen.getByRole("button", { name: "채팅방 나가기" });
    await user.click(leaveButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    // 모달에서 취소 클릭
    const cancelButton = screen.getByTestId("modal-cancel");
    await user.click(cancelButton);

    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
  });

  it("외부 클릭 시 메뉴가 닫힙니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    // 메뉴 열기
    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    expect(screen.getByRole("menu")).toBeInTheDocument();

    // 외부 클릭 시뮬레이션
    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("메뉴 내부 클릭 시 메뉴가 닫히지 않습니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    // 메뉴 열기
    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });
    await user.click(infoButton);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    // 메뉴 내부 클릭
    fireEvent.mouseDown(menu);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("정보 버튼을 다시 클릭하면 메뉴가 닫힙니다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatRoomHeaderInfoButton roomId={1} />);

    const infoButton = screen.getByRole("button", { name: "채팅방 메뉴 열기 버튼" });

    // 메뉴 열기
    await user.click(infoButton);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // 메뉴 닫기
    await user.click(infoButton);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
