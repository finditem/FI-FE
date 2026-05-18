import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MypageSearch from "./MypageSearch";

const mockRouterPush = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
  useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock("@/components/common", () => ({
  InputSearch: ({ name, placeholder, defaultValue, onEnter }: any) => (
    <input
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      data-testid="search-input"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter?.((e.target as HTMLInputElement).value);
        }
      }}
    />
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSearchParams.mockReturnValue({
    get: () => null,
    toString: () => "",
  });
});

describe("<MypageSearch />", () => {
  describe("기본 렌더링", () => {
    it("검색 input이 렌더된다", () => {
      render(<MypageSearch searchMode="posts" />);
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    it("placeholder가 '제목, 내용을 입력해 주세요.'로 렌더된다", () => {
      render(<MypageSearch searchMode="posts" />);
      expect(screen.getByPlaceholderText("제목, 내용을 입력해 주세요.")).toBeInTheDocument();
    });

    it("검색 영역 heading이 렌더된다", () => {
      render(<MypageSearch searchMode="posts" />);
      expect(screen.getByText("검색 영역")).toBeInTheDocument();
    });
  });

  describe("URL keyword 초기값", () => {
    it("URL에 keyword가 없으면 defaultValue가 빈 문자열이다", () => {
      render(<MypageSearch searchMode="posts" />);
      expect(screen.getByTestId("search-input")).toHaveValue("");
    });

    it("URL에 keyword가 있으면 defaultValue에 반영된다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "keyword" ? "분실물" : null),
        toString: () => "keyword=분실물",
      });
      render(<MypageSearch searchMode="posts" />);
      expect(screen.getByTestId("search-input")).toHaveValue("분실물");
    });
  });

  describe("검색 동작 - router.push 경로", () => {
    it("searchMode='posts'이면 /mypage/posts 경로로 push한다", () => {
      render(<MypageSearch searchMode="posts" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "분실물" } });
      fireEvent.keyDown(input, { key: "Enter" });
      const calledUrl = mockRouterPush.mock.calls[0]?.[0] ?? "";
      expect(decodeURIComponent(calledUrl)).toBe("/mypage/posts?keyword=분실물");
    });

    it("searchMode='favorites'이면 /mypage/favorites 경로로 push한다", () => {
      render(<MypageSearch searchMode="favorites" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "지갑" } });
      fireEvent.keyDown(input, { key: "Enter" });
      const calledUrl = mockRouterPush.mock.calls[0]?.[0] ?? "";
      expect(decodeURIComponent(calledUrl)).toBe("/mypage/favorites?keyword=지갑");
    });

    it("searchMode='comments'이면 /mypage/comments 경로로 push한다", () => {
      render(<MypageSearch searchMode="comments" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "댓글" } });
      fireEvent.keyDown(input, { key: "Enter" });
      const calledUrl = mockRouterPush.mock.calls[0]?.[0] ?? "";
      expect(decodeURIComponent(calledUrl)).toBe("/mypage/comments?keyword=댓글");
    });
  });

  describe("검색 동작 - keyword 파라미터 처리", () => {
    it("공백만 입력 후 Enter 시 keyword 파라미터를 제거한다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "keyword" ? "분실물" : null),
        toString: () => "keyword=분실물",
      });
      render(<MypageSearch searchMode="posts" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(mockRouterPush).toHaveBeenCalledWith("/mypage/posts?");
    });

    it("빈 문자열 입력 후 Enter 시 keyword 파라미터를 제거한다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "keyword" ? "분실물" : null),
        toString: () => "keyword=분실물",
      });
      render(<MypageSearch searchMode="posts" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "" } });
      fireEvent.keyDown(input, { key: "Enter" });
      expect(mockRouterPush).toHaveBeenCalledWith("/mypage/posts?");
    });

    it("기존 다른 쿼리 파라미터는 유지된다", () => {
      mockUseSearchParams.mockReturnValue({
        get: () => null,
        toString: () => "page=2",
      });
      render(<MypageSearch searchMode="posts" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "분실물" } });
      fireEvent.keyDown(input, { key: "Enter" });
      const calledUrl = mockRouterPush.mock.calls[0]?.[0] ?? "";
      expect(decodeURIComponent(calledUrl)).toBe("/mypage/posts?page=2&keyword=분실물");
    });

    it("Enter 외 다른 키 입력 시 router.push가 호출되지 않는다", () => {
      render(<MypageSearch searchMode="posts" />);
      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "분실물" } });
      fireEvent.keyDown(input, { key: "a" });
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });
});
