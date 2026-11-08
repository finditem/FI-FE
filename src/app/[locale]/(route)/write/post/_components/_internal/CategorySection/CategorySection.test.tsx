import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategorySection from "./CategorySection";

const setValueMock = jest.fn();
const useWatchMock = jest.fn((args: unknown) => undefined);

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    control: {},
    setValue: setValueMock,
  }),
  useWatch: (args: unknown) => useWatchMock(args),
}));

jest.mock("@/components/common", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
  RequiredText: () => <span data-testid="required-text">*</span>,
}));

jest.mock("@/components/domain", () => ({
  CategoryPopup: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="category-popup">
        <p>카테고리 팝업</p>
        <button onClick={onClose}>닫기</button>
      </div>
    ) : null,
}));

describe("CategorySection", () => {
  it("섹션이 렌더링되어야 한다", () => {
    render(<CategorySection />);
    expect(screen.getByLabelText("카테고리 선택")).toBeInTheDocument();
  });

  it("라벨 텍스트와 RequiredText가 표시되어야 한다", () => {
    render(<CategorySection />);
    expect(screen.getByText("카테고리를 선택해 주세요.")).toBeInTheDocument();
    expect(screen.getByTestId("required-text")).toBeInTheDocument();
  });

  it("화살표 아이콘이 표시되어야 한다", () => {
    render(<CategorySection />);
    expect(screen.getByTestId("icon-ArrowDown")).toBeInTheDocument();
  });

  it("섹션을 클릭하면 카테고리 팝업이 열려야 한다", async () => {
    render(<CategorySection />);
    expect(screen.queryByTestId("category-popup")).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText("카테고리 선택"));
    expect(screen.getByTestId("category-popup")).toBeInTheDocument();
  });

  it("팝업의 닫기 버튼을 누르면 팝업이 닫혀야 한다", async () => {
    render(<CategorySection />);
    await userEvent.click(screen.getByLabelText("카테고리 선택"));
    expect(screen.getByTestId("category-popup")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(screen.queryByTestId("category-popup")).not.toBeInTheDocument();
  });

  it("우측 버튼 요소가 존재해야 한다", () => {
    render(<CategorySection />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
