import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Location from "./Location";

describe("Location", () => {
  it("children과 기본 aria-label이 적용됩니다", () => {
    render(<Location>강남구</Location>);
    expect(screen.getByRole("button", { name: "상세 위치 보기" })).toHaveTextContent("강남구");
  });

  it("ariaLabel을 덮어쓸 수 있습니다", () => {
    render(<Location ariaLabel="지도 보기">서울</Location>);
    expect(screen.getByRole("button", { name: "지도 보기" })).toBeInTheDocument();
  });

  it("클릭 시 onClick이 호출됩니다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Location onClick={onClick}>주소</Location>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
