import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import PostDetail from "./PostDetail";
import { MOCK_POST_DEFAULT_DETAIL } from "@/mock/data";
import { ToastProvider } from "@/providers/ToastProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));
jest.mock("@/utils", () => {
  const actual = jest.requireActual("@/utils");

  return {
    ...actual,
    formatDate: (date: string) => "2025.12.26",
  };
});

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: Providers });
};

describe("게시글 상세 페이지", () => {
  it("게시글 상세 페이지의 제목이 렌더링되어야 한다.", () => {
    renderWithProviders(<PostDetail type="find" data={MOCK_POST_DEFAULT_DETAIL.result} />);

    const postDetailElement = screen.getByText("홍대입구역 8번 출구 앞에서 검정 지갑 발견");
    expect(postDetailElement).toBeInTheDocument();
  });

  it("게시글 상세 페이지의 시간이 렌더링되어야 한다.", () => {
    renderWithProviders(<PostDetail type="find" data={MOCK_POST_DEFAULT_DETAIL.result} />);

    const postDetailElement = screen.getByText("2025.12.26");
    expect(postDetailElement).toBeInTheDocument();
  });

  it("게시글 상세 페이지의 내용이 렌더링되어야 한다.", () => {
    renderWithProviders(<PostDetail type="find" data={MOCK_POST_DEFAULT_DETAIL.result} />);

    const postDetailElement = screen.getByText(
      "검정색 반지갑을 발견했습니다. 안에 카드/신분증이 일부 들어있습니다. 본인 확인 후 전달드릴게요."
    );
    expect(postDetailElement).toBeInTheDocument();
  });

  it("게시글 상세 페이지의 조회수와 좋아요가 렌더링되어야 한다.", () => {
    renderWithProviders(<PostDetail type="find" data={MOCK_POST_DEFAULT_DETAIL.result} />);

    const postDetailElement = screen.getByText(/조회/);
    expect(postDetailElement).toBeInTheDocument();

    const postDetailElement2 = screen.getByText(/즐겨찾기/);
    expect(postDetailElement2).toBeInTheDocument();
  });
});
