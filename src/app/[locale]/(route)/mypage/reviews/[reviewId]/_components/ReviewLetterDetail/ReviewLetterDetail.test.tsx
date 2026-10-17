import { render, screen } from "@testing-library/react";
import ReviewLetterDetail from "./ReviewLetterDetail";

// getTranslations(next-intl/server)를 ko 메시지 기반 translator로 대체한다.
jest.mock("next-intl/server", () => {
  const actual = jest.requireActual("next-intl");
  const koMessages = jest.requireActual("@/messages/ko.json");

  return {
    getTranslations: async (namespace?: string) =>
      actual.createTranslator({ locale: "ko", messages: koMessages, namespace }),
  };
});

// 편지 본문 유무 플래그를 테스트별로 제어한다(getter로 속성 읽기 시점에 평가).
let mockHasLetter = true;
jest.mock("../../_constants/MOCK_REVIEW", () => ({
  get MOCK_REVIEW_HAS_LETTER() {
    return mockHasLetter;
  },
}));

describe("ReviewLetterDetail", () => {
  beforeEach(() => {
    mockHasLetter = true;
  });

  it("발신자 정보, 편지 본문, 장점, 찾아준 물건, 채팅 CTA를 렌더한다", async () => {
    render(await ReviewLetterDetail({ reviewId: 1 }));

    expect(screen.getByText("우주강아지")).toBeInTheDocument();
    expect(screen.getByText("성동구 성수1동")).toBeInTheDocument();
    expect(screen.getByText(/늦은 밤에 연락드렸는데/)).toBeInTheDocument();
    expect(screen.getByText("친절하고 따뜻하게 대해주셨어요.")).toBeInTheDocument();
    expect(screen.getByText("휴대폰, 검정색 카드지갑 가죽케이스")).toBeInTheDocument();
    expect(screen.getByText("채팅창으로 이동하기")).toBeInTheDocument();
  });

  it("편지 본문이 없는 후기면 편지 영역을 렌더하지 않고 장점은 그대로 표시한다", async () => {
    mockHasLetter = false;

    render(await ReviewLetterDetail({ reviewId: 1 }));

    expect(screen.queryByText(/늦은 밤에 연락드렸는데/)).not.toBeInTheDocument();
    expect(screen.getByText("친절하고 따뜻하게 대해주셨어요.")).toBeInTheDocument();
    expect(screen.getByText("휴대폰, 검정색 카드지갑 가죽케이스")).toBeInTheDocument();
  });
});
