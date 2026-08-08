import { render, screen } from "@testing-library/react";
import AdminProfile from "./AdminProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetUsersMe } from "@/api/fetch/user";

jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : href?.pathname} {...rest}>
      {children}
    </a>
  );
});

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: jest.fn(),
}));

jest.mock("@/components/common", () => ({
  Button: ({ children, as: Component = "button", ...props }: any) => {
    return (
      <Component data-testid="button" {...props}>
        {children}
      </Component>
    );
  },
  ProfileAvatar: ({ src, alt, size }: any) => (
    <img data-testid="profile-avatar" src={src} alt={alt} data-size={size} />
  ),
}));

const mockedUseGetUsersMe = useGetUsersMe as jest.Mock;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (component: React.ReactNode) => {
  const queryClient = createTestQueryClient();

  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe("AdminProfile", () => {
  it("관리자 정보, 프로필 수정 버튼 렌더", () => {
    mockedUseGetUsersMe.mockReturnValue({
      data: {
        result: {
          nickname: "찾아줘 관리자",
          email: "admin@gmail.com",
          profileImg: "/admin-profile.png",
        },
      },
    });

    renderWithClient(<AdminProfile />);

    expect(screen.getByText("찾아줘 관리자")).toBeInTheDocument();
    expect(screen.getByText("admin@gmail.com")).toBeInTheDocument();

    const avatar = screen.getByTestId("profile-avatar");
    expect(avatar).toHaveAttribute("src", "/admin-profile.png");
    expect(avatar).toHaveAttribute("alt", "찾아줘 관리자");
    expect(avatar).toHaveAttribute("data-size", "60");

    const buttonLink = screen.getByRole("link", { name: "관리자 프로필 수정" });
    expect(buttonLink).toHaveAttribute("href", "/admin/profile");
    expect(buttonLink).toHaveAttribute("aria-label", "관리자 프로필 수정");
  });
});
