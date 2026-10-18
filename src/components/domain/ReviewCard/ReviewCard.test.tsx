import { fireEvent, render, screen } from "@testing-library/react";
import { MOCK_REVIEW_CARD } from "@/mock/data";
import ReviewCard from "./ReviewCard";

describe("ReviewCard", () => {
  it("닉네임, 위치, 본문, 대표 태그를 렌더한다", () => {
    render(<ReviewCard data={MOCK_REVIEW_CARD} />);
    expect(screen.getByText("우주강아지")).toBeInTheDocument();
    expect(screen.getByText("성동구 성수1동")).toBeInTheDocument();
    expect(screen.getByText(MOCK_REVIEW_CARD.content)).toBeInTheDocument();
    expect(screen.getByText(MOCK_REVIEW_CARD.tagLabel)).toBeInTheDocument();
  });

  it("extraTagCount가 있으면 +N 배지를 표시한다", () => {
    render(<ReviewCard data={MOCK_REVIEW_CARD} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("extraTagCount가 없으면 +N 배지를 표시하지 않는다", () => {
    render(<ReviewCard data={{ ...MOCK_REVIEW_CARD, extraTagCount: undefined }} />);
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("createdAt을 time 요소의 dateTime으로 노출한다", () => {
    render(<ReviewCard data={MOCK_REVIEW_CARD} />);
    const time = screen.getByText(MOCK_REVIEW_CARD.location).parentElement?.querySelector("time");
    expect(time).toHaveAttribute("dateTime", MOCK_REVIEW_CARD.createdAt);
  });

  it("showHideMenu가 기본값(true)이면 케밥 메뉴가 초기에 닫혀 있다", () => {
    render(<ReviewCard data={MOCK_REVIEW_CARD} />);
    const kebab = screen.getByRole("button", { name: "후기 더보기 메뉴 열기" });
    expect(kebab).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("후기 숨기기")).not.toBeInTheDocument();
  });

  it("케밥 메뉴를 열면 후기 숨기기 버튼이 나타난다", () => {
    render(<ReviewCard data={MOCK_REVIEW_CARD} />);
    fireEvent.click(screen.getByRole("button", { name: "후기 더보기 메뉴 열기" }));
    expect(screen.getByRole("button", { name: "후기 더보기 메뉴 닫기" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("후기 숨기기")).toBeInTheDocument();
  });

  it("showHideMenu가 false면 케밥 메뉴를 노출하지 않는다", () => {
    render(<ReviewCard data={MOCK_REVIEW_CARD} showHideMenu={false} />);
    expect(screen.queryByRole("button", { name: "후기 더보기 메뉴 열기" })).not.toBeInTheDocument();
    expect(screen.queryByText("후기 숨기기")).not.toBeInTheDocument();
  });
});
