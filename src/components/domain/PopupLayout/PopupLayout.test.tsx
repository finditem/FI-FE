import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PopupLayout from "./PopupLayout";

const mockUseModalLockAndEsc = jest.fn();
const mockUseModalBackdrop = jest.fn();

jest.mock("@/hooks", () => ({
  useModalLockAndEsc: (...args: any[]) => mockUseModalLockAndEsc(...args),
  useModalBackdrop: (args: { onClose?: () => void }) => {
    const handler = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) args.onClose?.();
    };
    mockUseModalBackdrop.mockImplementation(() => handler);
    return handler;
  },
}));

describe("<PopupLayout />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("isOpen=false이면 렌더하지 않습니다.", () => {
    const { container } = render(
      <PopupLayout isOpen={false} onClose={jest.fn()}>
        <p>내용</p>
      </PopupLayout>
    );
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("내용")).not.toBeInTheDocument();
  });

  it("isOpen=true이면 children을 렌더합니다.", () => {
    render(
      <PopupLayout isOpen onClose={jest.fn()}>
        <p>팝업 내용</p>
      </PopupLayout>
    );
    expect(screen.getByText("팝업 내용")).toBeInTheDocument();
  });

  it("백드롭에서 mousedown 시 onClose가 호출됩니다.", () => {
    const onClose = jest.fn();
    render(
      <PopupLayout isOpen onClose={onClose}>
        <p>팝업 내용</p>
      </PopupLayout>
    );

    const content = screen.getByText("팝업 내용").parentElement as HTMLElement;
    const backdrop = content.parentElement as HTMLElement;
    expect(backdrop).toBeInTheDocument();

    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("컨텐츠 내부 클릭은 이벤트 전파를 막아 onClose가 호출되지 않습니다.", () => {
    const onClose = jest.fn();
    render(
      <PopupLayout isOpen onClose={onClose}>
        <button>내부 버튼</button>
      </PopupLayout>
    );

    const content = screen.getByText("내부 버튼").parentElement as HTMLElement;

    fireEvent.mouseDown(content);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByText("내부 버튼"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("추가 className이 병합되어 적용됩니다.", () => {
    render(
      <PopupLayout isOpen className="custom-class">
        <p>내용</p>
      </PopupLayout>
    );

    const content = screen.getByText("내용").parentElement as HTMLElement;
    expect(content).toHaveClass("custom-class");
  });

  it("useModalLockAndEsc 훅이 올바른 파라미터로 호출됩니다.", () => {
    const onClose = jest.fn();
    render(
      <PopupLayout isOpen onClose={onClose}>
        <p>내용</p>
      </PopupLayout>
    );
    expect(mockUseModalLockAndEsc).toHaveBeenCalledWith({ isOpen: true, onClose });
  });
});
