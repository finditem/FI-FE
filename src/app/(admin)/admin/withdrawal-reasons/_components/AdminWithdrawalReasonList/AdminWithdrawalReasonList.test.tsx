import { render, screen, within } from "@testing-library/react";
import AdminWithdrawalReasonList from "./AdminWithdrawalReasonList";
import { MOCK_WITHDRAW_REASON_LIST } from "@/mock/data";
import { WITHDRAWAL_REASON_OPTIONS } from "../../_constants/WITHDRAWAL_REASON_OPTIONS";

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  formatDate: (iso: string) => `formatted:${iso}`,
}));

jest.mock("@/components/state", () => ({
  LoadingState: () => <div>loading...</div>,
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock("@/hooks", () => ({
  useInfiniteScroll: () => ({
    ref: jest.fn(),
  }),
}));

jest.mock("@/api/fetch/admin", () => ({
  useGetDeletedUsers: () => ({
    data: MOCK_WITHDRAW_REASON_LIST,
    isLoading: false,
    isError: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
  }),
}));

describe("AdminWithdrawalReasonList", () => {
  it("섹션 렌더링", () => {
    render(<AdminWithdrawalReasonList reason="" />);
    expect(screen.getByRole("region", { name: "유저 탈퇴 사유 목록" })).toBeInTheDocument();
  });

  it("mock 데이터 개수만큼 유저 아이템 렌더링", () => {
    render(<AdminWithdrawalReasonList reason="" />);

    const region = screen.getByRole("region", {
      name: "유저 탈퇴 사유 목록",
    });

    // 상위 유저 li만 필터
    const userItems = within(region)
      .getAllByRole("listitem")
      .filter((li) => li.className.includes("border-b"));

    expect(userItems).toHaveLength(MOCK_WITHDRAW_REASON_LIST.length);
  });

  it("유저 기본 정보 렌더링", () => {
    render(<AdminWithdrawalReasonList reason="" />);

    MOCK_WITHDRAW_REASON_LIST.forEach((item) => {
      expect(screen.getByRole("heading", { name: item.nickname })).toBeInTheDocument();

      expect(screen.getByText(item.email)).toBeInTheDocument();

      expect(screen.getByText(`formatted:${item.deletedAt}`)).toBeInTheDocument();
    });
  });

  it("탈퇴 사유 렌더링 (복수/OTHER 포함)", () => {
    render(<AdminWithdrawalReasonList reason="" />);

    MOCK_WITHDRAW_REASON_LIST.forEach((item) => {
      const reasons = item.withdrawalReason?.split(",") ?? [];

      reasons.forEach((reason) => {
        if (reason === "OTHER") {
          expect(
            screen.getByText(`(기타) ${item.withdrawalOtherReason ?? ""}`, { exact: false })
          ).toBeInTheDocument();
        } else {
          const label =
            WITHDRAWAL_REASON_OPTIONS.find((opt) => opt.value === reason)?.label ??
            "확인할 수 없어요.";

          expect(screen.getByText(label, { exact: false })).toBeInTheDocument();
        }
      });
    });
  });
});
