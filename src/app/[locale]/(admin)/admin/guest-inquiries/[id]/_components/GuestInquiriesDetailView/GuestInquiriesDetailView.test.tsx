import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GuestInquiriesDetailView from "./GuestInquiriesDetailView";
import { useGetDetailGuestInquiries } from "@/api/fetch/admin";

jest.mock("@/components/common", () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/state", () => ({
  LoadingState: () => <div data-testid="loading">loading</div>,
}));

jest.mock("@/app/[locale]/(admin)/admin/_components", () => ({
  AdminDetailSection: ({ data }: any) => (
    <div data-testid="detail-section" data-username={data?.email} />
  ),
}));

const addToastMock = jest.fn();
jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: addToastMock }),
}));

jest.mock("@/api/fetch/admin", () => ({
  useGetDetailGuestInquiries: jest.fn(),
}));

const mockedUseGetDetailGuestInquiries = useGetDetailGuestInquiries as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("GuestInquiriesDetailView", () => {
  beforeEach(() => {
    addToastMock.mockClear();

    mockedUseGetDetailGuestInquiries.mockReturnValue({
      data: {
        result: {
          email: "admin@gmail.com",
        },
      },
      isLoading: false,
      isError: false,
    });
  });

  it("상세 섹션 렌더", () => {
    render(<GuestInquiriesDetailView id={1} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("detail-section")).toBeInTheDocument();
    expect(screen.getByTestId("detail-section")).toHaveAttribute(
      "data-username",
      "admin@gmail.com"
    );
    expect(screen.getByRole("button", { name: "이메일 복사하기" })).toBeInTheDocument();
  });

  it("이메일 복사 성공 시 success 토스트", () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<GuestInquiriesDetailView id={1} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByRole("button", { name: "이메일 복사하기" }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith("admin@gmail.com");
    expect(addToastMock).toHaveBeenCalledWith("이메일을 클립보드에 복사했어요", "success");
  });

  it("이메일이 없으면 error 토스트", () => {
    mockedUseGetDetailGuestInquiries.mockReturnValue({
      data: {
        result: {
          email: "",
        },
      },
      isLoading: false,
      isError: false,
    });

    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<GuestInquiriesDetailView id={1} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByRole("button", { name: "이메일 복사하기" }));

    expect(writeText).not.toHaveBeenCalled();
    expect(addToastMock).toHaveBeenCalledWith("이메일이 존재하지 않아요", "error");
  });

  it("이메일 복사 실패 시 error 토스트", () => {
    const writeText = jest.fn(() => {
      throw new Error("fail");
    });
    Object.assign(navigator, { clipboard: { writeText } });

    render(<GuestInquiriesDetailView id={1} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByRole("button", { name: "이메일 복사하기" }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(addToastMock).toHaveBeenCalledWith("이메일 복사에 실패했어요", "error");
  });
});
