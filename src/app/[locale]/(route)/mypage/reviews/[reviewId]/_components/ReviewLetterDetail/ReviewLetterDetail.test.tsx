import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import type { ReviewDetailResponse } from "@/api/fetch/review";
import ReviewLetterDetail from "./ReviewLetterDetail";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const BASE_REVIEW: ReviewDetailResponse = {
  reviewId: 1,
  emotion: "GRATEFUL",
  helpTypes: ["KIND_AND_WARM", "SAFE_STORAGE"],
  content: "늦은 밤에 연락드렸는데 흔쾌히 나와주셔서 감사했어요.",
  createdAt: "2026-07-22T10:00:00",
  author: {
    userId: 3,
    nickname: "우주강아지",
    profileImageUrl: null,
    withdrawn: false,
  },
  recipient: {
    userId: 5,
    nickname: "성수317",
    profileImageUrl: null,
    withdrawn: false,
  },
  post: {
    postId: 7,
    title: "휴대폰, 검정색 카드지갑 가죽케이스",
    address: "서울 성동구 성수동",
    thumbnailUrl: null,
    date: "2025-11-11T10:00:00",
    createdAt: "2025-11-11T11:00:00",
    deleted: false,
  },
  roomId: 2,
};

const renderWith = (review: ReviewDetailResponse) => render(<ReviewLetterDetail review={review} />);

describe("ReviewLetterDetail", () => {
  beforeEach(() => jest.clearAllMocks());

  it("발신자, 편지 본문, 도움 경험(순서대로), 찾아준 물건, 채팅 CTA를 렌더한다", () => {
    renderWith(BASE_REVIEW);

    expect(screen.getByText("우주강아지")).toBeInTheDocument();
    expect(screen.getByText(/늦은 밤에 연락드렸는데/)).toBeInTheDocument();
    expect(screen.getByText("친절하고 따뜻하게 대해주셨어요.")).toBeInTheDocument();
    expect(screen.getByText("물건을 안전하게 보관해 주셨어요.")).toBeInTheDocument();
    expect(screen.getByText("휴대폰, 검정색 카드지갑 가죽케이스")).toBeInTheDocument();
    expect(screen.getByText("채팅창으로 이동하기")).toBeInTheDocument();
  });

  it("content가 null이면 편지 본문 영역을 렌더하지 않는다", () => {
    renderWith({ ...BASE_REVIEW, content: null });

    expect(screen.queryByText(/늦은 밤에 연락드렸는데/)).not.toBeInTheDocument();
    expect(screen.getByText("친절하고 따뜻하게 대해주셨어요.")).toBeInTheDocument();
  });

  it("탈퇴한 발신자면 기본 닉네임을 표시한다", () => {
    renderWith({
      ...BASE_REVIEW,
      author: { userId: null, nickname: null, profileImageUrl: null, withdrawn: true },
    });

    expect(screen.getByText("탈퇴한 사용자")).toBeInTheDocument();
  });

  it("roomId가 있으면 채팅 CTA 클릭 시 해당 채팅방으로 이동한다", async () => {
    const user = userEvent.setup();
    renderWith(BASE_REVIEW);

    await user.click(screen.getByText("채팅창으로 이동하기"));

    expect(mockPush).toHaveBeenCalledWith("/chat/7?roomId=2");
  });

  it("roomId가 null이면 채팅 CTA가 비활성화된다", () => {
    renderWith({ ...BASE_REVIEW, roomId: null });

    expect(screen.getByText("채팅창으로 이동하기").closest("button")).toBeDisabled();
  });
});
