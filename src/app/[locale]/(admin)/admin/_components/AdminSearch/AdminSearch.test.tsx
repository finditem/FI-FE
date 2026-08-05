import { render, screen } from "@testing-library/react";
import AdminSearch from "./AdminSearch";

const inputSearchMock = jest.fn();

jest.mock("@/components/common", () => ({
  InputSearch: (props: any) => {
    inputSearchMock(props);
    return (
      <div
        data-testid="input-search"
        data-placeholder={props.placeholder}
        data-name={props.name}
        data-mode={props.mode}
      />
    );
  },
}));

describe("AdminSearch", () => {
  beforeEach(() => {
    inputSearchMock.mockClear();
  });

  it("기본 placeholder로 InputSearch에 props 전달", () => {
    const onEnter = jest.fn();

    render(<AdminSearch onEnter={onEnter} />);

    expect(screen.getByTestId("input-search")).toHaveAttribute(
      "data-placeholder",
      "제목, 내용을 입력해 주세요."
    );
    expect(screen.getByTestId("input-search")).toHaveAttribute("data-name", "search");
    expect(screen.getByTestId("input-search")).toHaveAttribute("data-mode", "onChange");

    expect(inputSearchMock).toHaveBeenCalledTimes(1);
    expect(inputSearchMock.mock.calls[0][0].onEnter).toBe(onEnter);
  });

  it("placeholder prop을 주면 해당 값으로 전달", () => {
    const onEnter = jest.fn();

    render(<AdminSearch placeholder="검색하세요" onEnter={onEnter} />);

    expect(screen.getByTestId("input-search")).toHaveAttribute("data-placeholder", "검색하세요");
    expect(inputSearchMock).toHaveBeenCalledTimes(1);
    expect(inputSearchMock.mock.calls[0][0].placeholder).toBe("검색하세요");
  });
});
