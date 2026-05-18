import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Terms from "./Terms";

const mockAddToast = jest.fn();
const mockMutate = jest.fn();

let mockIsError = false;
let mockSettingData: any = null;
let mockIsPending = false;

jest.mock("@/api/fetch/notification", () => ({
  useGetNotificationSetting: () => ({
    data: mockSettingData,
    isError: mockIsError,
  }),
}));

jest.mock("@/api/fetch/notification/api/usePutNotificationSetting", () => ({
  __esModule: true,
  default: () => ({ mutate: mockMutate, isPending: mockIsPending }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("@/components/layout", () => ({
  DetailHeader: ({ title }: any) => <h1>{title}</h1>,
}));

jest.mock("@/components/domain", () => ({
  FooterButton: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/common", () => ({
  CheckBox: ({ id, label, checked, onChange, disabled }: any) => (
    <label htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={!!checked}
        onChange={onChange}
        disabled={!!disabled}
      />
      {label}
    </label>
  ),
}));

jest.mock("@/app/(route)/mypage/notifications/_constants/DEFAULT_NOTIFICATION_SETTING", () => ({
  DEFAULT_NOTIFICATION_SETTING: {
    commentEnabled: false,
    chatEnabled: false,
    inquiryReplyEnabled: false,
    reportResultEnabled: false,
    favoriteEnabled: false,
    noticeEnabled: false,
    categoryEnabled: false,
    enabledCategories: [],
    browserNotificationEnabled: false,
    marketingConsent: false,
    contentPolicyAgreed: false,
    termsOfServiceAgreed: false,
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockIsError = false;
  mockSettingData = null;
  mockIsPending = false;
});

describe("<Terms />", () => {
  describe("기본 렌더링", () => {
    it("유효한 termName이면 콘텐츠가 렌더된다", () => {
      render(<Terms termName="privacyPolicyAgreed" />);
      expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    });

    it("유효하지 않은 termName이면 아무것도 렌더되지 않는다", () => {
      const { container } = render(<Terms termName="invalidTerm" />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("pageType별 헤더", () => {
    it("pageType='TERM'(기본값)이면 termHeader가 헤더에 표시된다", () => {
      render(<Terms termName="privacyPolicyAgreed" />);
      expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    });

    it("pageType='SIGN_UP'이면 title이 헤더에 표시된다", () => {
      render(<Terms termName="privacyPolicyAgreed" pageType="SIGN_UP" />);
      expect(screen.getByText("개인정보 수집 및 이용 동의 (필수)")).toBeInTheDocument();
    });
  });

  describe("동의 버튼 (showButton)", () => {
    it("showButton=true이면 '동의' 버튼이 렌더된다", () => {
      render(<Terms termName="privacyPolicyAgreed" showButton={true} onAgree={jest.fn()} />);
      expect(screen.getByText("동의")).toBeInTheDocument();
    });

    it("showButton=true일 때 '동의' 버튼 클릭 시 onAgree가 호출된다", () => {
      const onAgree = jest.fn();
      render(<Terms termName="privacyPolicyAgreed" showButton={true} onAgree={onAgree} />);
      fireEvent.click(screen.getByText("동의"));
      expect(onAgree).toHaveBeenCalledTimes(1);
    });

    it("showButton=false(기본값)이면 '동의' 버튼이 렌더되지 않는다", () => {
      render(<Terms termName="privacyPolicyAgreed" />);
      expect(screen.queryByText("동의")).not.toBeInTheDocument();
    });
  });

  describe("선택 약관 체크박스 (pageType='TERM')", () => {
    it("marketingConsent + pageType='TERM'이면 체크박스가 렌더된다", () => {
      render(<Terms termName="marketingConsent" pageType="TERM" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("contentPolicyAgreed + pageType='TERM'이면 체크박스가 렌더된다", () => {
      render(<Terms termName="contentPolicyAgreed" pageType="TERM" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("필수 약관(privacyPolicyAgreed) + pageType='TERM'이면 체크박스가 렌더되지 않는다", () => {
      render(<Terms termName="privacyPolicyAgreed" pageType="TERM" />);
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("선택 약관 + pageType='SIGN_UP'이면 체크박스가 렌더되지 않는다", () => {
      render(<Terms termName="marketingConsent" pageType="SIGN_UP" />);
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("체크박스 클릭 시 SettingMutate가 호출된다", () => {
      mockSettingData = {
        result: {
          marketingConsent: false,
          contentPolicyAgreed: false,
        },
      };
      render(<Terms termName="marketingConsent" pageType="TERM" />);
      fireEvent.click(screen.getByRole("checkbox"));
      expect(mockMutate).toHaveBeenCalled();
    });

    it("isPending=true이면 체크박스가 비활성화된다", () => {
      mockIsPending = true;
      render(<Terms termName="marketingConsent" pageType="TERM" />);
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });

  describe("isError 처리", () => {
    it("isError=true이면 addToast가 경고 메시지로 호출된다", () => {
      mockIsError = true;
      render(<Terms termName="marketingConsent" pageType="TERM" />);
      expect(mockAddToast).toHaveBeenCalledTimes(1);
      expect(mockAddToast).toHaveBeenCalledWith("정보를 불러오는데 실패했어요", "warning");
    });
  });
});
