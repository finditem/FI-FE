import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TermsAgreement from "./TermsAgreement";
import { TERMS_CONFIG } from "./_constants/TERMS_CONFIG";

let mockIsValid = false;
let mockSelectAll = false;
let mockTermsValue = [false, false, false, false, false];

const mockSetValue = jest.fn();
const mockRegister = jest.fn((name: string) => ({ name }));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: mockRegister,
    setValue: mockSetValue,
    control: {},
    formState: { isValid: mockIsValid },
  }),
  useWatch: ({ name }: any) => {
    if (name === "selectAll") return mockSelectAll;
    if (Array.isArray(name)) return mockTermsValue;
    return undefined;
  },
}));

jest.mock("@/components/layout", () => ({
  DetailHeader: ({ title }: any) => <h1>{title}</h1>,
}));

jest.mock("@/components/common", () => ({
  CheckBox: ({ id, label, checked, onChange }: any) => (
    <label htmlFor={id}>
      <input type="checkbox" id={id} checked={!!checked} onChange={onChange} />
      {label}
    </label>
  ),
  Icon: () => <span />,
}));

jest.mock("../FooterButton/FooterButton", () => ({
  __esModule: true,
  default: ({ children, onClick, disabled }: any) => (
    <button type="button" onClick={onClick} disabled={!!disabled}>
      {children}
    </button>
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockIsValid = false;
  mockSelectAll = false;
  mockTermsValue = [false, false, false, false, false];
});

describe("<TermsAgreement />", () => {
  describe("기본 렌더링", () => {
    it("'서비스 이용을 위해 약관 동의가 필요합니다.' 텍스트가 렌더된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      expect(screen.getByText(/약관 동의가 필요합니다/)).toBeInTheDocument();
    });

    it("기본 title '회원가입'이 헤더에 렌더된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      expect(screen.getByText("회원가입")).toBeInTheDocument();
    });

    it("title prop이 전달되면 해당 title이 헤더에 렌더된다", () => {
      render(
        <TermsAgreement title="카카오 회원가입" onOpenDetail={jest.fn()} onComplete={jest.fn()} />
      );
      expect(screen.getByText("카카오 회원가입")).toBeInTheDocument();
    });

    it("'전체 약관 동의' 체크박스가 렌더된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      expect(screen.getByLabelText("전체 약관 동의")).toBeInTheDocument();
    });

    it("TERMS_CONFIG의 모든 항목(5개)이 체크박스로 렌더된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      TERMS_CONFIG.forEach((item) => {
        expect(screen.getByLabelText(item.label)).toBeInTheDocument();
      });
    });

    it("'가입 완료' 버튼이 렌더된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      expect(screen.getByText("가입 완료")).toBeInTheDocument();
    });
  });

  describe("가입 완료 버튼 활성화 상태", () => {
    it("isValid=false이면 '가입 완료' 버튼이 비활성화된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      expect(screen.getByText("가입 완료")).toBeDisabled();
    });

    it("isValid=true이면 '가입 완료' 버튼이 활성화된다", () => {
      mockIsValid = true;
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      expect(screen.getByText("가입 완료")).not.toBeDisabled();
    });

    it("isPending=true이면 isValid=true여도 '가입 완료' 버튼이 비활성화된다", () => {
      mockIsValid = true;
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} isPending={true} />);
      expect(screen.getByText("가입 완료")).toBeDisabled();
    });
  });

  describe("가입 완료 버튼 클릭", () => {
    it("클릭 시 onComplete가 호출된다", () => {
      mockIsValid = true;
      const onComplete = jest.fn();
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={onComplete} />);
      fireEvent.click(screen.getByText("가입 완료"));
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("상세보기 버튼", () => {
    it("over14Age 항목에는 상세보기 버튼이 없다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      // TERMS_CONFIG 5개 항목 중 over14Age 제외 4개 + 가입 완료 = 5개 버튼
      const buttons = screen.getAllByRole("button");
      // "가입 완료" 외 나머지 = 4개 상세보기 버튼
      expect(buttons).toHaveLength(5);
    });

    it("privacyPolicyAgreed 상세보기 클릭 시 onOpenDetail이 'privacyPolicyAgreed'로 호출된다", () => {
      const onOpenDetail = jest.fn();
      render(<TermsAgreement onOpenDetail={onOpenDetail} onComplete={jest.fn()} />);
      // getAllByRole("button") 순서: [0]privacyPolicyAgreed, [1]termsOfServiceAgreed, ...
      fireEvent.click(screen.getAllByRole("button")[0]);
      expect(onOpenDetail).toHaveBeenCalledWith("privacyPolicyAgreed");
    });

    it("termsOfServiceAgreed 상세보기 클릭 시 onOpenDetail이 'termsOfServiceAgreed'로 호출된다", () => {
      const onOpenDetail = jest.fn();
      render(<TermsAgreement onOpenDetail={onOpenDetail} onComplete={jest.fn()} />);
      fireEvent.click(screen.getAllByRole("button")[1]);
      expect(onOpenDetail).toHaveBeenCalledWith("termsOfServiceAgreed");
    });
  });

  describe("전체 약관 동의 토글", () => {
    it("전체 약관 동의 체크 시 setValue가 호출된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      fireEvent.click(screen.getByLabelText("전체 약관 동의"));
      expect(mockSetValue).toHaveBeenCalled();
    });

    it("전체 약관 동의 체크 시 TERMS_CONFIG 항목 수(5)만큼 + selectAll 포함해 setValue가 호출된다", () => {
      render(<TermsAgreement onOpenDetail={jest.fn()} onComplete={jest.fn()} />);
      fireEvent.click(screen.getByLabelText("전체 약관 동의"));
      expect(mockSetValue).toHaveBeenCalledTimes(TERMS_CONFIG.length + 1);
    });
  });
});
