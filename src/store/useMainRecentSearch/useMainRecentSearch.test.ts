import { useMainRecentSearch } from "./useMainRecentSearch";

describe("useMainRecentSearch", () => {
  beforeEach(() => {
    localStorage.clear();
    useMainRecentSearch.getState().clearRecentSearch();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("공백만 있는 키워드는 추가하지 않습니다", () => {
    useMainRecentSearch.getState().addRecentSearch("   ");
    expect(useMainRecentSearch.getState().recentItems).toHaveLength(0);
  });

  it("addRecentSearch는 트림한 키워드를 최신 순 맨 앞에 넣습니다", () => {
    useMainRecentSearch.getState().addRecentSearch("  열쇠  ");
    const items = useMainRecentSearch.getState().recentItems;
    expect(items).toHaveLength(1);
    expect(items[0].keyword).toBe("열쇠");
    expect(items[0].searchedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("같은 키워드를 다시 추가하면 맨 앞으로 옮기고 searchedAt을 갱신합니다", () => {
    jest.setSystemTime(new Date("2024-06-01T10:00:00.000Z"));
    useMainRecentSearch.getState().addRecentSearch("a");
    const firstAt = useMainRecentSearch.getState().recentItems[0].searchedAt;

    useMainRecentSearch.getState().addRecentSearch("b");
    expect(useMainRecentSearch.getState().recentItems[0].keyword).toBe("b");

    jest.setSystemTime(new Date("2024-06-02T10:00:00.000Z"));
    useMainRecentSearch.getState().addRecentSearch("a");
    const items = useMainRecentSearch.getState().recentItems;
    expect(items[0].keyword).toBe("a");
    expect(items[0].searchedAt).not.toBe(firstAt);
    expect(items[1].keyword).toBe("b");
  });

  it("최대 개수를 넘기면 오래된 항목부터 잘라냅니다", () => {
    for (let i = 0; i < 11; i += 1) {
      useMainRecentSearch.getState().addRecentSearch(`k${i}`);
    }
    const items = useMainRecentSearch.getState().recentItems;
    expect(items).toHaveLength(10);
    expect(items[0].keyword).toBe("k10");
    expect(items[9].keyword).toBe("k1");
  });

  it("removeRecentSearch는 해당 키워드만 제거합니다", () => {
    useMainRecentSearch.getState().addRecentSearch("a");
    useMainRecentSearch.getState().addRecentSearch("b");
    useMainRecentSearch.getState().removeRecentSearch("a");
    expect(useMainRecentSearch.getState().recentItems.map((x) => x.keyword)).toEqual(["b"]);
  });

  it("clearRecentSearch는 목록을 비웁니다", () => {
    useMainRecentSearch.getState().addRecentSearch("x");
    useMainRecentSearch.getState().clearRecentSearch();
    expect(useMainRecentSearch.getState().recentItems).toEqual([]);
  });
});
