import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUpContainer from "./SignUpContainer";

const mockUseSignUpSubmit = jest.fn();
const mockUseSignUpFlow = jest.fn();
const mockSetValue = jest.fn();
const mockOnNext = jest.fn();
const mockOpenTermDetail = jest.fn();
const mockOnAgreeTerm = jest.fn();
const mockCompleteTerms = jest.fn();

jest.mock("../../_hooks/useSignUpSubmit", () => ({
  useSignUpSubmit: () => mockUseSignUpSubmit(),
}));

jest.mock("../../_hooks/useSignUpFlow", () => ({
  useSignUpFlow: () => mockUseSignUpFlow(),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({ setValue: mockSetValue }),
}));

jest.mock("../SignUpField/SignUpField", () => ({
  __esModule: true,
  default: ({ onNext }: any) => (
    <div data-testid="sign-up-field">
      <button type="button" onClick={onNext}>
        다음
      </button>
    </div>
  ),
}));

jest.mock("@/components/domain", () => ({
  TermsAgreement: ({ onComplete, onOpenDetail, isPending }: any) => (
    <div data-testid="terms-agreement" data-pending={isPending}>
      <button type="button" onClick={onComplete}>
        완료
      </button>
      <button type="button" onClick={() => onOpenDetail("privacyPolicy")}>
        약관 상세 보기
      </button>
    </div>
  ),
  Terms: ({ termName, onAgree }: any) => (
    <div data-testid="terms">
      <span data-testid="term-name">{termName}</span>
      <button type="button" onClick={onAgree}>
        동의
      </button>
    </div>
  ),
}));

const defaultFlowReturn = {
  step: "1",
  termName: "",
  onNext: mockOnNext,
  openTermDetail: mockOpenTermDetail,
  onAgreeTerm: mockOnAgreeTerm,
  completeTerms: mockCompleteTerms,
};

describe("<SignUpContainer />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSignUpSubmit.mockReturnValue({ submitSignUp: jest.fn(), isPending: false });
    mockUseSignUpFlow.mockReturnValue(defaultFlowReturn);
  });

  describe("step='1'", () => {
    it("SignUpField가 렌더된다", () => {
      render(<SignUpContainer />);
      expect(screen.getByTestId("sign-up-field")).toBeInTheDocument();
    });

    it("TermsAgreement가 렌더되지 않는다", () => {
      render(<SignUpContainer />);
      expect(screen.queryByTestId("terms-agreement")).not.toBeInTheDocument();
    });
  });

  describe("step='2' && !termName", () => {
    beforeEach(() => {
      mockUseSignUpFlow.mockReturnValue({ ...defaultFlowReturn, step: "2", termName: "" });
    });

    it("TermsAgreement가 렌더된다", () => {
      render(<SignUpContainer />);
      expect(screen.getByTestId("terms-agreement")).toBeInTheDocument();
    });

    it("SignUpField가 렌더되지 않는다", () => {
      render(<SignUpContainer />);
      expect(screen.queryByTestId("sign-up-field")).not.toBeInTheDocument();
    });
  });

  describe("step='2' && termName 있음", () => {
    beforeEach(() => {
      mockUseSignUpFlow.mockReturnValue({
        ...defaultFlowReturn,
        step: "2",
        termName: "privacyPolicy",
      });
    });

    it("Terms가 렌더된다", () => {
      render(<SignUpContainer />);
      expect(screen.getByTestId("terms")).toBeInTheDocument();
    });

    it("Terms에 termName이 올바르게 전달된다", () => {
      render(<SignUpContainer />);
      expect(screen.getByTestId("term-name")).toHaveTextContent("privacyPolicy");
    });
  });

  describe("Terms 동의 처리", () => {
    beforeEach(() => {
      mockUseSignUpFlow.mockReturnValue({
        ...defaultFlowReturn,
        step: "2",
        termName: "privacyPolicy",
      });
    });

    it("onAgree 호출 시 setValue(termName, true)가 호출된다", () => {
      render(<SignUpContainer />);
      fireEvent.click(screen.getByRole("button", { name: "동의" }));
      expect(mockSetValue).toHaveBeenCalledWith("privacyPolicy", true, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    it("onAgree 호출 시 onAgreeTerm(2)이 호출된다", () => {
      render(<SignUpContainer />);
      fireEvent.click(screen.getByRole("button", { name: "동의" }));
      expect(mockOnAgreeTerm).toHaveBeenCalledWith(2);
    });
  });

  describe("isPending 전달", () => {
    it("isPending=true이면 TermsAgreement에 isPending=true가 전달된다", () => {
      mockUseSignUpSubmit.mockReturnValue({ submitSignUp: jest.fn(), isPending: true });
      mockUseSignUpFlow.mockReturnValue({ ...defaultFlowReturn, step: "2", termName: "" });
      render(<SignUpContainer />);
      expect(screen.getByTestId("terms-agreement")).toHaveAttribute("data-pending", "true");
    });
  });
});
