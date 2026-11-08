import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import ReviewDetailPage from "./page";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("./_components", () => ({
  ReviewDetailContent: ({ reviewId }: { reviewId: number }) => (
    <div data-testid="review-detail-content">{reviewId}</div>
  ),
}));

const renderPage = (reviewId: string) =>
  ReviewDetailPage({ params: Promise.resolve({ reviewId }) });

describe("ReviewDetailPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("유효한 양의 정수 reviewId면 해당 값으로 ReviewDetailContent를 렌더한다", async () => {
    render(await renderPage("5"));

    expect(screen.getByTestId("review-detail-content")).toHaveTextContent("5");
    expect(notFound).not.toHaveBeenCalled();
  });

  it.each(["abc", "0", "-1", "1.5", ""])(
    "잘못된 reviewId(%s)면 notFound를 호출한다",
    async (reviewId) => {
      await expect(renderPage(reviewId)).rejects.toThrow();

      expect(notFound).toHaveBeenCalled();
    }
  );
});
