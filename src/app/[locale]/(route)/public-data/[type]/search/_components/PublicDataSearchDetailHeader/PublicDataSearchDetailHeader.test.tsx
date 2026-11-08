import { render, screen } from "@testing-library/react";
import PublicDataSearchDetailHeader from "./PublicDataSearchDetailHeader";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
}));

jest.mock("@/components/layout", () => ({
  DetailHeader: ({ title }: { title: React.ReactNode }) => <div>{title}</div>,
}));

const { useParams } = jest.requireMock("next/navigation");

describe("PublicDataSearchDetailHeader", () => {
  it("type=found이면 '습득물 검색'을 표시한다", () => {
    useParams.mockReturnValue({ type: "found" });
    render(<PublicDataSearchDetailHeader />);
    expect(screen.getByText("습득물 검색")).toBeInTheDocument();
  });

  it("type=lost이면 '분실물 검색'을 표시한다", () => {
    useParams.mockReturnValue({ type: "lost" });
    render(<PublicDataSearchDetailHeader />);
    expect(screen.getByText("분실물 검색")).toBeInTheDocument();
  });

  it("type이 유효하지 않은 값이면 '분실물 검색'으로 폴백한다", () => {
    useParams.mockReturnValue({ type: "unknown" });
    render(<PublicDataSearchDetailHeader />);
    expect(screen.getByText("분실물 검색")).toBeInTheDocument();
  });

  it("type이 없으면 '분실물 검색'으로 폴백한다", () => {
    useParams.mockReturnValue({});
    render(<PublicDataSearchDetailHeader />);
    expect(screen.getByText("분실물 검색")).toBeInTheDocument();
  });

  it("police24 로고 이미지를 렌더한다", () => {
    useParams.mockReturnValue({ type: "lost" });
    const { container } = render(<PublicDataSearchDetailHeader />);
    expect(container.querySelector('img[src*="police24"]')).toBeInTheDocument();
  });
});
