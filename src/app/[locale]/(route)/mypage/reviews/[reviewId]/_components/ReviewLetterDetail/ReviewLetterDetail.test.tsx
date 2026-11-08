import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import type { ReviewDetailResponse } from "@/api/fetch/review";
import { MOCK_REVIEW_DETAIL } from "@/mock/data";
import ReviewLetterDetail from "./ReviewLetterDetail";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const renderWith = (review: ReviewDetailResponse) => render(<ReviewLetterDetail review={review} />);

describe("ReviewLetterDetail", () => {
  beforeEach(() => jest.clearAllMocks());

  it("발신자, 편지 본문, 도움 경험(순서대로), 찾아준 물건, 채팅 CTA를 렌더한다", () => {
    renderWith(MOCK_REVIEW_DETAIL);

    expect(screen.getByText("우주강아지")).toBeInTheDocument();
    expect(screen.getByText(/늦은 밤에 연락드렸는데/)).toBeInTheDocument();
    expect(screen.getByText("친절하고 따뜻하게 대해주셨어요.")).toBeInTheDocument();
    expect(screen.getByText("물건을 안전하게 보관해 주셨어요.")).toBeInTheDocument();
    expect(screen.getByText("휴대폰, 검정색 카드지갑 가죽케이스")).toBeInTheDocument();
    expect(screen.getByText("채팅창으로 이동하기")).toBeInTheDocument();
  });

  it("content가 null이면 편지 본문 영역을 렌더하지 않는다", () => {
    renderWith({ ...MOCK_REVIEW_DETAIL, content: null });

    expect(screen.queryByText(/늦은 밤에 연락드렸는데/)).not.toBeInTheDocument();
    expect(screen.getByText("친절하고 따뜻하게 대해주셨어요.")).toBeInTheDocument();
  });

  it("탈퇴한 발신자면 기본 닉네임을 표시한다", () => {
    renderWith({
      ...MOCK_REVIEW_DETAIL,
      author: { userId: null, nickname: null, profileImageUrl: null, withdrawn: true },
    });

    expect(screen.getByText("탈퇴한 사용자")).toBeInTheDocument();
  });

  it("roomId가 있으면 채팅 CTA 클릭 시 해당 채팅방으로 이동한다", async () => {
    const user = userEvent.setup();
    renderWith(MOCK_REVIEW_DETAIL);

    await user.click(screen.getByText("채팅창으로 이동하기"));

    expect(mockPush).toHaveBeenCalledWith("/chat/7?roomId=2");
  });

  it("roomId가 null이면 채팅 CTA가 비활성화된다", () => {
    renderWith({ ...MOCK_REVIEW_DETAIL, roomId: null });

    expect(screen.getByText("채팅창으로 이동하기").closest("button")).toBeDisabled();
  });
});
