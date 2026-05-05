import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import PostDetailKakaoMap from "./PostDetailKakaoMap";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/domain", () => ({
  BaseKakaoMap: ({ center, level, children }: any) => (
    <div
      data-testid="base-kakao-map"
      data-lat={center.lat}
      data-lng={center.lng}
      data-level={level}
    >
      {children}
    </div>
  ),
}));

const mockUseSearchParams = useSearchParams as jest.Mock;

describe("PostDetailKakaoMap", () => {
  it("searchParams가 없을 때 기본 주소가 표시되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({ get: () => null });

    render(<PostDetailKakaoMap />);

    expect(screen.getByText("서울특별시 중구 세종대로 110 서울특별시청")).toBeInTheDocument();
  });

  it("searchParams의 address가 화면에 표시되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "address" ? "서울특별시 마포구 양화로 160" : null),
    });

    render(<PostDetailKakaoMap />);

    expect(screen.getByText("서울특별시 마포구 양화로 160")).toBeInTheDocument();
  });

  it("URL 인코딩된 address가 디코딩되어 표시되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) =>
        key === "address" ? encodeURIComponent("서울특별시 강남구 테헤란로 427") : null,
    });

    render(<PostDetailKakaoMap />);

    expect(screen.getByText("서울특별시 강남구 테헤란로 427")).toBeInTheDocument();
  });

  it("sr-only 제목 '지도 영역'이 렌더링되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({ get: () => null });

    render(<PostDetailKakaoMap />);

    expect(screen.getByRole("heading", { name: "지도 영역" })).toBeInTheDocument();
  });

  it("searchParams의 좌표가 지도에 올바르게 전달되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => {
        const params: Record<string, string> = { lat: "37.5565", lng: "126.9239" };
        return params[key] ?? null;
      },
    });

    render(<PostDetailKakaoMap />);

    const map = screen.getByTestId("base-kakao-map");
    expect(map).toHaveAttribute("data-lat", "37.5565");
    expect(map).toHaveAttribute("data-lng", "126.9239");
  });

  it("radius 1000일 때 지도 레벨 6으로 전달되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "radius" ? "1000" : null),
    });

    render(<PostDetailKakaoMap />);

    expect(screen.getByTestId("base-kakao-map")).toHaveAttribute("data-level", "6");
  });

  it("radius 3000일 때 지도 레벨 7으로 전달되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "radius" ? "3000" : null),
    });

    render(<PostDetailKakaoMap />);

    expect(screen.getByTestId("base-kakao-map")).toHaveAttribute("data-level", "7");
  });

  it("radius 5000일 때 지도 레벨 8으로 전달되어야 한다.", () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "radius" ? "5000" : null),
    });

    render(<PostDetailKakaoMap />);

    expect(screen.getByTestId("base-kakao-map")).toHaveAttribute("data-level", "8");
  });
});
