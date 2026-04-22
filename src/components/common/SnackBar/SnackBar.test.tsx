import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SnackBar from "./SnackBar";

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

describe("<SnackBar />", () => {
  it("메시지를 렌더링합니다.", () => {
    render(<SnackBar message="저장되었습니다." />);
    expect(screen.getByText("저장되었습니다.")).toBeInTheDocument();
  });

  it("role이 status이고 aria-live가 polite입니다.", () => {
    render(<SnackBar message="저장되었습니다." />);
    const snackbar = screen.getByRole("status");
    expect(snackbar).toHaveAttribute("aria-live", "polite");
  });

  it("actionLabel만 전달하면 버튼이 렌더링되지 않습니다.", () => {
    render(<SnackBar message="저장되었습니다." actionLabel="이동" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("actionHandler만 전달하면 버튼이 렌더링되지 않습니다.", () => {
    render(<SnackBar message="저장되었습니다." actionHandler={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("actionLabel과 actionHandler를 함께 전달하면 버튼이 렌더링됩니다.", () => {
    render(
      <SnackBar
        message="저장되었습니다."
        actionLabel="차단 목록으로 이동"
        actionHandler={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: "차단 목록으로 이동" })).toBeInTheDocument();
  });

  it("액션 버튼 클릭 시 actionHandler가 호출됩니다.", async () => {
    const handler = jest.fn();
    render(<SnackBar message="저장되었습니다." actionLabel="실행" actionHandler={handler} />);

    await userEvent.click(screen.getByRole("button", { name: "실행" }));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("className prop이 컨테이너에 적용됩니다.", () => {
    render(<SnackBar message="저장되었습니다." className="custom-class" />);
    expect(screen.getByRole("status").className).toContain("custom-class");
  });
});
