import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteAccountModal from "./DeleteAccountModal";

const mockHandleSubmit = jest.fn((fn) => () => fn({}));
const mockSetModalOpen = jest.fn();
const mockOnBack = jest.fn();

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    handleSubmit: mockHandleSubmit,
    formState: { isSubmitting: false },
  }),
}));

jest.mock("@/components/common/Modal/_internal/ModalLayout", () => ({
  __esModule: true,
  default: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
  }) => (isOpen ? <div>{children}</div> : null),
}));

jest.mock("@/components/common", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("DeleteAccountModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("modalOpen=false이면 렌더되지 않는다", () => {
    render(
      <DeleteAccountModal modalOpen={false} setModalOpen={mockSetModalOpen} onBack={mockOnBack} />
    );
    expect(screen.queryByText("정말로 탈퇴하시겠습니까?")).not.toBeInTheDocument();
  });

  it("modalOpen=true이면 확인 문구가 렌더된다", () => {
    render(
      <DeleteAccountModal modalOpen={true} setModalOpen={mockSetModalOpen} onBack={mockOnBack} />
    );
    expect(screen.getByText("정말로 탈퇴하시겠습니까?")).toBeInTheDocument();
  });

  it("취소 버튼 클릭 시 setModalOpen(false)와 onBack이 호출된다", () => {
    render(
      <DeleteAccountModal modalOpen={true} setModalOpen={mockSetModalOpen} onBack={mockOnBack} />
    );
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it("탈퇴하기 버튼 클릭 시 DOM에 있는 form의 requestSubmit이 호출된다", () => {
    const mockRequestSubmit = jest
      .spyOn(HTMLFormElement.prototype, "requestSubmit")
      .mockImplementation(() => {});
    const form = document.createElement("form");
    document.body.appendChild(form);
    render(
      <DeleteAccountModal modalOpen={true} setModalOpen={mockSetModalOpen} onBack={mockOnBack} />
    );
    fireEvent.click(screen.getByRole("button", { name: "탈퇴하기" }));
    expect(mockRequestSubmit).toHaveBeenCalled();
    document.body.removeChild(form);
    mockRequestSubmit.mockRestore();
  });
});
