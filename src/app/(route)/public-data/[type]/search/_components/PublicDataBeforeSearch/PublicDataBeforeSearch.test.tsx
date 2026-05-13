import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PublicDataBeforeSearch from "./PublicDataBeforeSearch";

const makeItem = (keyword: string, timestamp: number) => ({ keyword, timestamp });

describe("PublicDataBeforeSearch", () => {
  const removeSearch = jest.fn();
  const onSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("빈 상태", () => {
    it("recentSearches가 비어 있으면 '최근 검색한 기록이 없어요.'를 표시한다", () => {
      render(
        <PublicDataBeforeSearch
          recentSearches={[]}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      expect(screen.getByText("최근 검색한 기록이 없어요.")).toBeInTheDocument();
    });

    it("빈 상태에서는 목록이 렌더되지 않는다", () => {
      render(
        <PublicDataBeforeSearch
          recentSearches={[]}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("목록 렌더", () => {
    const items = [
      makeItem("지갑", new Date("2024-03-05").getTime()),
      makeItem("휴대폰", new Date("2024-07-20").getTime()),
    ];

    it("recentSearches의 키워드가 모두 표시된다", () => {
      render(
        <PublicDataBeforeSearch
          recentSearches={items}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      expect(screen.getByText("지갑")).toBeInTheDocument();
      expect(screen.getByText("휴대폰")).toBeInTheDocument();
    });

    it("timestamp가 MM.DD 형식으로 표시된다", () => {
      render(
        <PublicDataBeforeSearch
          recentSearches={[makeItem("지갑", new Date("2024-03-05").getTime())]}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      expect(screen.getByText("03.05")).toBeInTheDocument();
    });

    it("time 요소의 dateTime 속성이 YYYY-MM-DD 형식이다", () => {
      render(
        <PublicDataBeforeSearch
          recentSearches={[makeItem("지갑", new Date("2024-03-05").getTime())]}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      expect(screen.getByRole("time")).toHaveAttribute("dateTime", "2024-03-05");
    });
  });

  describe("인터랙션", () => {
    const items = [makeItem("지갑", Date.now()), makeItem("휴대폰", Date.now())];

    it("키워드 버튼 클릭 시 onSearch가 해당 키워드로 호출된다", async () => {
      const user = userEvent.setup();
      render(
        <PublicDataBeforeSearch
          recentSearches={items}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      await user.click(screen.getByRole("button", { name: /지갑/ }));
      expect(onSearch).toHaveBeenCalledWith("지갑");
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it("삭제 버튼 클릭 시 removeSearch가 해당 키워드로 호출된다", async () => {
      const user = userEvent.setup();
      render(
        <PublicDataBeforeSearch
          recentSearches={items}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      const deleteButtons = screen.getAllByRole("button");
      // 각 항목당 키워드 버튼 1개 + 삭제 버튼 1개 → 삭제 버튼은 짝수 인덱스 이후
      // '지갑' 행의 삭제 버튼은 두 번째 버튼
      await user.click(deleteButtons[1]);
      expect(removeSearch).toHaveBeenCalledWith("지갑");
      expect(removeSearch).toHaveBeenCalledTimes(1);
    });

    it("삭제 버튼 클릭 시 onSearch는 호출되지 않는다", async () => {
      const user = userEvent.setup();
      render(
        <PublicDataBeforeSearch
          recentSearches={[makeItem("지갑", Date.now())]}
          removeSearch={removeSearch}
          onSearch={onSearch}
        />
      );
      const buttons = screen.getAllByRole("button");
      await user.click(buttons[1]);
      expect(onSearch).not.toHaveBeenCalled();
    });
  });
});
