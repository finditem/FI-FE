import { render, screen } from "@testing-library/react";
import UserProfileDetailHeader from "./UserProfileDetailHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({
  useParams: () => ({ userId: "1" }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

jest.mock("@/components/layout", () => {
  const DetailHeader = ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );

  const HeaderMenu = ({ ariaLabel }: any) => <button aria-label={ariaLabel}>Menu</button>;

  return {
    DetailHeader,
    HeaderMenu,
  };
});

const queryClient = new QueryClient();

describe("UserProfileDetailHeader", () => {
  it("DetailHeader.Menu의 ariaLabel이 '더보기 메뉴'로 설정되어야 합니다", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfileDetailHeader />
      </QueryClientProvider>
    );
    const menu = screen.getByRole("button", { name: "더보기 메뉴" });
    expect(menu).toBeInTheDocument();
  });
});
