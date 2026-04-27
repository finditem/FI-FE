import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteAccountReason from "./DeleteAccountReason";

const mockSetValue = jest.fn();
const mockWatch = jest.fn();
const mockRegister = jest.fn(() => ({}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: mockSetValue,
    watch: mockWatch,
    register: mockRegister,
    formState: { isValid: true },
  }),
}));

jest.mock("@/components/common", () => ({
  CheckBox: ({
    label,
    checked,
    onChange,
    id,
  }: {
    label: string;
    checked: boolean;
    onChange: () => void;
    id: string;
  }) => (
    <label htmlFor={id}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} readOnly />
      {label}
    </label>
  ),
  InputField: ({ placeholder }: { placeholder: string }) => <input placeholder={placeholder} />,
}));

jest.mock("@/components/domain", () => ({
  FooterButton: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("../DeleteAccountModal/DeleteAccountModal", () => ({
  __esModule: true,
  default: ({ modalOpen }: { modalOpen: boolean }) =>
    modalOpen ? <div>탈퇴 확인 모달</div> : null,
}));

describe("DeleteAccountReason", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWatch.mockReturnValue([]);
  });

  it("탈퇴 이유 선택 화면이 렌더된다", () => {
    render(<DeleteAccountReason onNext={jest.fn()} />);
    expect(screen.getByText("탈퇴하시려는 이유를 알려주세요.")).toBeInTheDocument();
    expect(screen.getByText("최대 3개 선택")).toBeInTheDocument();
  });

  it("선택된 항목이 없으면 버튼이 비활성화된다", () => {
    render(<DeleteAccountReason onNext={jest.fn()} />);
    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  it("체크박스 선택 시 setValue가 선택된 값으로 호출된다", () => {
    render(<DeleteAccountReason onNext={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("잘 사용하지 않아요"));
    expect(mockSetValue).toHaveBeenCalledWith("reasons", ["NOT_USING"], {
      shouldValidate: true,
      shouldDirty: true,
    });
  });

  it("이미 선택된 항목을 재클릭하면 선택이 해제된다", () => {
    mockWatch.mockReturnValue(["NOT_USING"]);
    render(<DeleteAccountReason onNext={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("잘 사용하지 않아요"));
    expect(mockSetValue).toHaveBeenCalledWith("reasons", [], {
      shouldValidate: true,
      shouldDirty: true,
    });
  });

  it("선택 항목이 3개일 때 새 항목 선택 시 첫 번째가 제거되고 새 항목이 추가된다", () => {
    mockWatch.mockReturnValue(["NOT_USING", "LOW_TRUST", "DIFFICULT_TO_USE"]);
    render(<DeleteAccountReason onNext={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("다른 계정이 있어요"));
    expect(mockSetValue).toHaveBeenCalledWith(
      "reasons",
      ["LOW_TRUST", "DIFFICULT_TO_USE", "DUPLICATE_ACCOUNT"],
      { shouldValidate: true, shouldDirty: true }
    );
  });

  it("socialUser=false이면 버튼 텍스트가 '다음'이고 클릭 시 onNext가 호출된다", () => {
    mockWatch.mockReturnValue(["NOT_USING"]);
    const onNext = jest.fn();
    render(<DeleteAccountReason onNext={onNext} socialUser={false} />);
    fireEvent.click(screen.getByRole("button", { name: "다음" }));
    expect(onNext).toHaveBeenCalled();
  });

  it("socialUser=true이면 버튼 텍스트가 '탈퇴하기'이고 클릭 시 모달이 열린다", () => {
    mockWatch.mockReturnValue(["NOT_USING"]);
    render(<DeleteAccountReason onNext={jest.fn()} socialUser={true} />);
    fireEvent.click(screen.getByRole("button", { name: "탈퇴하기" }));
    expect(screen.getByText("탈퇴 확인 모달")).toBeInTheDocument();
  });

  it("OTHER 선택 시 기타 사유 입력 필드가 노출된다", () => {
    mockWatch.mockReturnValue(["OTHER"]);
    render(<DeleteAccountReason onNext={jest.fn()} />);
    expect(
      screen.getByPlaceholderText("서비스를 탈퇴하려는 이유를 작성해 주세요.")
    ).toBeInTheDocument();
  });
});
