import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { useSearchUpdateQueryString } from "@/hooks";
import NoticeSearchForm from "./NoticeSearchForm";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  useSearchUpdateQueryString: jest.fn(),
}));

const mockSearchUpdateQuery = jest.fn();

describe("NoticeSearchForm", () => {
  beforeEach(() => {
    mockSearchUpdateQuery.mockClear();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (useSearchUpdateQueryString as jest.Mock).mockReturnValue({
      searchUpdateQuery: mockSearchUpdateQuery,
      searchMode: "default",
    });
  });

  it("placeholder가 노출되는 검색 입력과 폼을 렌더합니다", () => {
    render(<NoticeSearchForm />);
    expect(screen.getByPlaceholderText("제목, 내용을 입력해 주세요.")).toBeInTheDocument();
  });

  it("URL의 keyword가 있으면 입력값과 동기화합니다", async () => {
    const params = new URLSearchParams();
    params.set("keyword", "점검");
    (useSearchParams as jest.Mock).mockReturnValue(params);

    render(<NoticeSearchForm />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("제목, 내용을 입력해 주세요.")).toHaveValue("점검");
    });
  });

  it("제출 시 검색어 trim 후 keyword로 searchUpdateQuery를 호출합니다", async () => {
    const user = userEvent.setup();
    render(<NoticeSearchForm />);

    const input = screen.getByPlaceholderText("제목, 내용을 입력해 주세요.");
    await user.type(input, "  서비스  ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockSearchUpdateQuery).toHaveBeenCalledWith("keyword", "서비스");
    });
  });

  it("공백만 입력 후 제출하면 keyword를 제거합니다", async () => {
    const user = userEvent.setup();
    render(<NoticeSearchForm />);

    const input = screen.getByPlaceholderText("제목, 내용을 입력해 주세요.");
    await user.type(input, "   ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockSearchUpdateQuery).toHaveBeenCalledWith("keyword", undefined);
    });
  });
});
