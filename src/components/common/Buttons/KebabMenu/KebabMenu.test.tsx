import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KebabMenu from "./KebabMenu";

describe("KebabMenu", () => {
  it("items 텍스트가 순서대로 렌더링됩니다", () => {
    render(
      <KebabMenu
        items={[
          { text: "편집", onClick: jest.fn() },
          { text: "삭제", onClick: jest.fn() },
        ]}
      />
    );
    expect(screen.getByRole("button", { name: /편집/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /삭제/ })).toBeInTheDocument();
  });

  it("항목 onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    render(<KebabMenu items={[{ text: "편집", onClick: onEdit }]} />);
    await user.click(screen.getByRole("button", { name: /편집/ }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("loading이면 해당 행에 더보기 텍스트 대신 스피너만 보입니다", () => {
    render(<KebabMenu items={[{ text: "불러오는 중", loading: true, onClick: jest.fn() }]} />);
    expect(screen.queryByText("불러오는 중")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
