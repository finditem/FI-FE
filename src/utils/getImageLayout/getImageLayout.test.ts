import { getImageLayout, getSpecialLayoutGroups } from "./getImageLayout";

const urls = (n: number) => Array.from({ length: n }, (_, i) => `https://ex.test/${i}.jpg`);

describe("getImageLayout", () => {
  it("0장이면 items와 containerClass가 비어 있다", () => {
    expect(getImageLayout([])).toEqual({ items: [], containerClass: "" });
    expect(getImageLayout()).toEqual({ items: [], containerClass: "" });
  });

  it("1장이면 1열만 쓰고 colSpan 2, 148x148", () => {
    const r = getImageLayout(urls(1));
    expect(r.items).toEqual([
      { src: "https://ex.test/0.jpg", width: 148, height: 148, colSpan: 2 },
    ]);
    expect(r.containerClass).toBe("grid gap-2 grid-cols-1");
  });

  it("2장이면 2열·각 148, colSpan 1", () => {
    const r = getImageLayout(urls(2));
    expect(r.items).toHaveLength(2);
    r.items.forEach((it) => {
      expect(it).toMatchObject({ width: 148, height: 148, colSpan: 1 });
    });
    expect(r.containerClass).toBe("grid gap-2 grid-cols-2");
  });

  it("3장이면 3열·각 96, colSpan 1", () => {
    const r = getImageLayout(urls(3));
    expect(r.items).toHaveLength(3);
    r.items.forEach((it) => {
      expect(it).toMatchObject({ width: 96, height: 96, colSpan: 1 });
    });
    expect(r.containerClass).toBe("grid gap-2 grid-cols-3");
  });

  it("4장이면 2열·각 96, colSpan 1", () => {
    const r = getImageLayout(urls(4));
    expect(r.items).toHaveLength(4);
    expect(r.containerClass).toBe("grid gap-2 grid-cols-2");
  });

  it("5장이면 특수 flex 레이아웃·isSpecialLayout", () => {
    const r = getImageLayout(urls(5));
    expect(r.isSpecialLayout).toBe(true);
    expect(r.containerClass).toBe("flex flex-col gap-2");
    expect(r.items).toEqual([
      { src: "https://ex.test/0.jpg", width: 148, height: 96 },
      { src: "https://ex.test/1.jpg", width: 148, height: 96 },
      { src: "https://ex.test/2.jpg", width: 96, height: 96 },
      { src: "https://ex.test/3.jpg", width: 96, height: 96 },
      { src: "https://ex.test/4.jpg", width: 96, height: 96 },
    ]);
  });

  it("6장 이상이면 비어 있다", () => {
    expect(getImageLayout(urls(6))).toEqual({ items: [], containerClass: "" });
  });
});

describe("getSpecialLayoutGroups", () => {
  it("5개면 앞 2·나머지 3으로 나눈다", () => {
    const items = [1, 2, 3, 4, 5].map((i) => ({
      src: `a${i}`,
      width: 1,
      height: 1,
    }));
    expect(getSpecialLayoutGroups(items)).toEqual({
      topRow: items.slice(0, 2),
      bottomRow: items.slice(2),
    });
  });

  it("0개면 둘 다 빈 배열", () => {
    expect(getSpecialLayoutGroups([])).toEqual({ topRow: [], bottomRow: [] });
  });
});
