import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoticeListErrorButtons from "./NoticeListErrorButtons";
import { ReactNode } from "react";

const mockRefetchQueries = jest.fn();

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    refetchQueries: mockRefetchQueries,
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("NoticeListErrorButtons", () => {
  beforeEach(() => {
    mockRefetchQueries.mockClear();
  });

  it("새로고침 클릭 시 notices 쿼리를 refetch합니다", async () => {
    const user = userEvent.setup();
    render(<NoticeListErrorButtons />);

    await user.click(screen.getByRole("button", { name: "새로고침" }));

    expect(mockRefetchQueries).toHaveBeenCalledTimes(1);
    expect(mockRefetchQueries).toHaveBeenCalledWith({ queryKey: ["notices"] });
  });

  it("고객센터 문의 링크가 /inquiry-write를 가리킵니다", () => {
    render(<NoticeListErrorButtons />);
    expect(screen.getByRole("link", { name: "고객센터 문의" })).toHaveAttribute(
      "href",
      "/inquiry-write"
    );
  });
});
