import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import InquiryWriteDetailHeader from "./InquiryWriteDetailHeader";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("InquiryWriteDetailHeader", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("제목과 스크린리더용 제목을 렌더한다", () => {
    render(<InquiryWriteDetailHeader isDisabled={false} onSubmit={jest.fn()} />);
    expect(
      screen.getByRole("heading", { name: "무엇을 도와드릴까요?", level: 2 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "1:1 문의하기 작성", level: 1 })
    ).toBeInTheDocument();
  });

  it("등록 버튼 클릭 시 onSubmit이 호출된다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<InquiryWriteDetailHeader isDisabled={false} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "게시글 저장" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("isDisabled이면 등록 버튼이 비활성화된다", () => {
    render(<InquiryWriteDetailHeader isDisabled onSubmit={jest.fn()} />);
    const submit = screen.getByRole("button", { name: "게시글 저장" });
    expect(submit).toBeDisabled();
    expect(submit).toHaveClass("text-neutralInversed-strong-default");
  });
});
