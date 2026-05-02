import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useReport from "@/api/fetch/report/api/useReport";
import { REPORT_REASONS } from "./_internal/REPORT_REASONS";
import ReportModal from "./ReportModal";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

jest.mock("@/api/fetch/report/api/useReport");

describe("ReportModal", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useReport as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
  });

  it("isOpen이 false이면 포털 콘텐츠가 없습니다", () => {
    const { container } = render(
      <ReportModal isOpen={false} onClose={jest.fn()} targetType="POST" targetId={1} />
    );
    expect(container.querySelector('[role="presentation"]')).not.toBeInTheDocument();
  });

  it("isOpen이 true이면 신고하기 헤더와 제출 버튼이 보입니다", () => {
    render(<ReportModal isOpen onClose={jest.fn()} targetType="POST" targetId={42} />);
    expect(screen.getByRole("heading", { name: "신고하기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "차단 및 신고하기" })).toBeDisabled();
  });

  it("뒤로가기 버튼 클릭 시 onClose가 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ReportModal isOpen onClose={onClose} targetType="COMMENT" targetId={9} />);
    await user.click(screen.getByRole("button", { name: "뒤로가기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("신고 사유를 선택하면 제출이 가능해지고, 제출 시 mutate가 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ReportModal isOpen onClose={onClose} targetType="CHAT" targetId={100} />);

    await user.click(screen.getByRole("button", { name: "신고 사유 선택" }));
    expect(screen.getByRole("heading", { name: "신고 사유 선택" })).toBeInTheDocument();

    const firstLabel = REPORT_REASONS[0].label;
    await user.click(screen.getByText(firstLabel));
    await user.click(screen.getByRole("button", { name: "선택하기" }));

    const submit = screen.getByRole("button", { name: "차단 및 신고하기" });
    expect(submit).not.toBeDisabled();

    await user.click(submit);
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        targetType: "CHAT",
        targetId: 100,
        reportType: REPORT_REASONS[0].value,
        reason: "",
      })
    );
  });
});
