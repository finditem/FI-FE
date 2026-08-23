import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import LanguageDropdown from "./LanguageDropdown";
import { usePathname, useRouter } from "@/i18n/navigation";

const mockReplace = jest.fn();
const mockRefresh = jest.fn();

jest.mock("@/i18n/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/components", () => ({
  Icon: () => <span />,
}));

jest.mock("next-intl", () => {
  const actual = jest.requireActual("next-intl");

  return {
    ...actual,
    useTranslations: (namespace?: string) =>
      actual.createTranslator({
        locale: "ko",
        messages: jest.requireActual("@/messages/ko.json"),
        namespace,
      }),
    useLocale: jest.fn(() => "ko"),
  };
});

describe("LanguageDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/login");
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, refresh: mockRefresh });
    (useLocale as jest.Mock).mockReturnValue("ko");
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  it("기본 로케일(한국어)일 때 트리거 버튼에 Language가 표시됩니다", () => {
    render(<LanguageDropdown />);

    expect(screen.getByRole("button", { name: "언어 선택" })).toHaveTextContent("Language");
  });

  it("영어 로케일일 때 트리거 버튼에 English가 표시됩니다", () => {
    (useLocale as jest.Mock).mockReturnValue("en");

    render(<LanguageDropdown />);

    expect(screen.getByRole("button", { name: "언어 선택" })).toHaveTextContent("English");
  });

  it("트리거 클릭 시 옵션 리스트가 표시됩니다", async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown />);

    await user.click(screen.getByRole("button", { name: "언어 선택" }));

    expect(screen.getByText("한국어")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("현재 로케일(한국어) 옵션을 클릭하면 라우팅하지 않고 닫힙니다", async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown />);

    await user.click(screen.getByRole("button", { name: "언어 선택" }));
    await user.click(screen.getByText("한국어"));

    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });

  it("다른 로케일(English) 옵션을 클릭하면 해당 로케일로 라우팅하고 닫힙니다", async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown />);

    await user.click(screen.getByRole("button", { name: "언어 선택" }));
    await user.click(screen.getByText("English"));

    expect(mockReplace).toHaveBeenCalledWith("/login", { locale: "en" });
    expect(mockRefresh).toHaveBeenCalled();
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });

  it("쿼리 파라미터(callbackUrl, reason)가 있을 때 로케일 전환 시에도 유지됩니다", async () => {
    const user = userEvent.setup();
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({ callbackUrl: "/mypage", reason: "session-expired" })
    );
    render(<LanguageDropdown />);

    await user.click(screen.getByRole("button", { name: "언어 선택" }));
    await user.click(screen.getByText("English"));

    expect(mockReplace).toHaveBeenCalledWith(
      "/login?callbackUrl=%2Fmypage&reason=session-expired",
      {
        locale: "en",
      }
    );
  });

  it("외부 클릭 시 드롭다운이 닫힙니다", async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown />);

    await user.click(screen.getByRole("button", { name: "언어 선택" }));
    expect(screen.getByText("English")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });

  it("트리거를 다시 클릭하면 드롭다운이 닫힙니다", async () => {
    const user = userEvent.setup();
    render(<LanguageDropdown />);

    const trigger = screen.getByRole("button", { name: "언어 선택" });
    await user.click(trigger);
    expect(screen.getByText("English")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });
});
