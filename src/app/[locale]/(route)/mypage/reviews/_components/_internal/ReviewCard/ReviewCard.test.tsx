import { fireEvent, render, screen } from "@testing-library/react";
import type { ReviewCardData } from "../../../_types/ReviewCardData";
import ReviewCard from "./ReviewCard";

const baseData: ReviewCardData = {
  id: 1,
  nickname: "우주강아지",
  location: "성동구 성수1동",
  createdAt: "2026-07-22T10:00:00.000Z",
  content: "늦은 밤에 연락드렸는데 흔쾌히 나와주셔서 감사했어요.",
  tagLabel: "친절하고 따뜻하게 대해주셨어요.",
  extraTagCount: 1,
};

describe("ReviewCard", () => {
  it("닉네임, 위치, 본문, 대표 태그를 렌더한다", () => {
    render(<ReviewCard data={baseData} />);

    expect(screen.getByText("우주강아지")).toBeInTheDocument();
    expect(screen.getByText("성동구 성수1동")).toBeInTheDocument();
    expect(screen.getByText(baseData.content)).toBeInTheDocument();
    expect(screen.getByText(baseData.tagLabel)).toBeInTheDocument();
  });

  it("extraTagCount가 있으면 +N 배지를 표시한다", () => {
    render(<ReviewCard data={baseData} />);

    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("extraTagCount가 없으면 +N 배지를 표시하지 않는다", () => {
    render(<ReviewCard data={{ ...baseData, extraTagCount: undefined }} />);

    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("createdAt을 time 요소의 dateTime으로 노출한다", () => {
    render(<ReviewCard data={baseData} />);

    const time = screen.getByText(baseData.location).parentElement?.querySelector("time");
    expect(time).toHaveAttribute("dateTime", baseData.createdAt);
  });

  it("초기에는 케밥 메뉴가 닫혀 있다", () => {
    render(<ReviewCard data={baseData} />);

    const kebab = screen.getByRole("button", { name: "후기 더보기 메뉴 열기" });
    expect(kebab).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("후기 숨기기")).not.toBeInTheDocument();
  });

  it("케밥 메뉴를 열면 후기 숨기기 버튼이 나타난다", () => {
    render(<ReviewCard data={baseData} />);

    fireEvent.click(screen.getByRole("button", { name: "후기 더보기 메뉴 열기" }));

    expect(screen.getByRole("button", { name: "후기 더보기 메뉴 닫기" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("후기 숨기기")).toBeInTheDocument();
  });
});
