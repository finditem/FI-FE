import { renderHook } from "@testing-library/react";
import { useHiddenPath } from "./useHiddenPath";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockPathname = usePathname as jest.Mock;

describe("useHiddenPath - Footer가 노출되어야 하는 페이지", () => {
  beforeEach(() => {
    mockPathname.mockReset();
  });
  it("홈('/')에서는 Footer가 보여야 하므로 false를 반환한다", () => {
    mockPathname.mockReturnValue("/");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(false);
  });

  it("게시글 리스트('/list')에서는 Footer가 보여야 하므로 false를 반환한다", () => {
    mockPathname.mockReturnValue("/list");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(false);
  });

  it("채팅 리스트('/chat')에서는 Footer가 보여야 하므로 false를 반환한다", () => {
    mockPathname.mockReturnValue("/chat");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(false);
  });

  it("알림 리스트('/alert')에서는 Footer가 보여야 하므로 false를 반환한다", () => {
    mockPathname.mockReturnValue("/alert");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(false);
  });

  it("마이페이지 메인('/mypage')에서는 Footer가 보여야 하므로 false를 반환한다", () => {
    mockPathname.mockReturnValue("/mypage");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(false);
  });

  it("관리자 메인('/admin')에서는 Footer가 보여야 하므로 false를 반환한다", () => {
    mockPathname.mockReturnValue("/admin");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(false);
  });
});

describe("useHiddenPath - 나머지 모든 페이지에서는 Footer가 숨겨져야 한다", () => {
  beforeEach(() => {
    mockPathname.mockReset();
  });

  it("허용 목록에 없는 일반 페이지('/about')에서는 Footer를 숨기므로 true를 반환한다", () => {
    mockPathname.mockReturnValue("/about");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(true);
  });

  it("pathname이 null이면 빈 문자열로 처리되며 허용 목록에 없으므로 true를 반환한다", () => {
    mockPathname.mockReturnValue(null);
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(true);
  });

  it("pathname이 undefined이면 빈 문자열로 처리되며 허용 목록에 없으므로 true를 반환한다", () => {
    mockPathname.mockReturnValue(undefined);
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(true);
  });

  it("관리자 하위 경로('/admin/users')에서는 Footer를 숨기므로 true를 반환한다", () => {
    mockPathname.mockReturnValue("/admin/users");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(true);
  });

  it("마이페이지 하위 리스트(/mypage/posts 등)에서는 Footer를 숨기므로 true를 반환한다", () => {
    ["/mypage/posts", "/mypage/reports", "/mypage/inquiries"].forEach((path) => {
      mockPathname.mockReturnValue(path);
      const { result } = renderHook(() => useHiddenPath());
      expect(result.current).toBe(true);
    });
  });

  it("게시글 상세(/list/1)에서는 Footer를 숨기므로 true를 반환한다", () => {
    mockPathname.mockReturnValue("/list/1");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(true);
  });

  it("채팅방 상세(/chat/1)에서는 Footer를 숨기므로 true를 반환한다", () => {
    mockPathname.mockReturnValue("/chat/1");
    const { result } = renderHook(() => useHiddenPath());
    expect(result.current).toBe(true);
  });

  it("마이페이지 상세(/mypage/reports/1, /mypage/inquiries/123)에서는 Footer를 숨기므로 true를 반환한다", () => {
    ["/mypage/reports/1", "/mypage/inquiries/123"].forEach((path) => {
      mockPathname.mockReturnValue(path);
      const { result } = renderHook(() => useHiddenPath());
      expect(result.current).toBe(true);
    });
  });
});
