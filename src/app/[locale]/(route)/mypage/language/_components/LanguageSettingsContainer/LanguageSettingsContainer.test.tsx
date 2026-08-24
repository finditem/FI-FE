import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useRouter } from "@/i18n/navigation";
import LanguageSettingsContainer from "./LanguageSettingsContainer";

const mockReplace = jest.fn();
const mockRefresh = jest.fn();

jest.mock("@/i18n/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LanguageSettingsContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, refresh: mockRefresh });
  });

  it("현재 로케일(한국어)이 기본 선택되고 변경하기 버튼은 비활성화됩니다", () => {
    render(<LanguageSettingsContainer />);

    expect(screen.getByRole("radio", { name: "한국어" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "English" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "변경하기" })).toBeDisabled();
  });

  it("다른 로케일을 선택하면 변경하기 버튼이 활성화됩니다", async () => {
    const user = userEvent.setup();
    render(<LanguageSettingsContainer />);

    await user.click(screen.getByRole("radio", { name: "English" }));

    expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
    expect(screen.getByRole("button", { name: "변경하기" })).toBeEnabled();
  });

  it("변경하기 클릭 시 선택한 로케일로 마이페이지 메인으로 이동합니다", async () => {
    const user = userEvent.setup();
    render(<LanguageSettingsContainer />);

    await user.click(screen.getByRole("radio", { name: "English" }));
    await user.click(screen.getByRole("button", { name: "변경하기" }));

    expect(mockReplace).toHaveBeenCalledWith("/mypage", { locale: "en" });
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("현재 로케일을 유지한 채 변경하기를 눌러도 라우팅하지 않습니다", async () => {
    const user = userEvent.setup();
    render(<LanguageSettingsContainer />);

    await user.click(screen.getByRole("radio", { name: "한국어" }));
    await user.click(screen.getByRole("button", { name: "변경하기" }));

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
