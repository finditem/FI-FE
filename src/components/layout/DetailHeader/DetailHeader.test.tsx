import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailHeader from "./DetailHeader";
import { HeaderSave, HeaderSearch } from "./DetailHeaderParts";

const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("DetailHeader", () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
    sessionStorage.clear();
  });

  it("title과 뒤로가기 버튼을 렌더합니다", () => {
    render(<DetailHeader title="테스트 제목" />);
    expect(screen.getByRole("heading", { name: "테스트 제목" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "뒤로가기" })).toBeInTheDocument();
  });

  it("onBack이 있으면 뒤로가기 클릭 시 onBack만 호출하고 router.back은 호출하지 않습니다", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    render(<DetailHeader title="제목" onBack={onBack} />);
    await user.click(screen.getByRole("button", { name: "뒤로가기" }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("onBack이 없고 히스토리 카운트가 1보다 크면 router.back을 호출합니다", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("__fmi_history_count", "2");
    render(<DetailHeader title="제목" />);
    await user.click(screen.getByRole("button", { name: "뒤로가기" }));
    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("onBack이 없고 히스토리 카운트가 1 이하면 홈으로 push합니다", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("__fmi_history_count", "1");
    render(<DetailHeader title="제목" />);
    await user.click(screen.getByRole("button", { name: "뒤로가기" }));
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("children이 있으면 헤더 액션 영역에 렌더합니다", () => {
    render(
      <DetailHeader title="테스트">
        <HeaderSearch onClick={jest.fn()} />
      </DetailHeader>
    );
    expect(screen.getByLabelText("헤더 액션")).toBeInTheDocument();
  });

  it("HeaderSearch 클릭 시 onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(
      <DetailHeader title="테스트">
        <HeaderSearch onClick={handleSearch} />
      </DetailHeader>
    );
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(handleSearch).toHaveBeenCalled();
  });

  it("HeaderSave를 children으로 넣으면 비활성 시 스타일 클래스가 적용됩니다", () => {
    render(
      <DetailHeader title="작성">
        <HeaderSave disabled />
      </DetailHeader>
    );
    expect(screen.getByRole("button", { name: "게시글 저장" })).toHaveClass("text-flatGreen-200");
  });
});
