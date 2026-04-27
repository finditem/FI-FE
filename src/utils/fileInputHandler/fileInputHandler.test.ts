import { ChangeEvent } from "react";
import { fileInputHandler } from "./fileInputHandler";

const createPng = (name: string) => new File([name], name, { type: "image/png" });

const createMockFileList = (files: File[]): FileList =>
  ({
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* () {
      for (const f of files) {
        yield f;
      }
    },
  }) as FileList;

const createFileChangeEvent = (files: File[]) => {
  const target = {
    files: createMockFileList(files),
    value: "",
  } as HTMLInputElement;
  return { target } as unknown as ChangeEvent<HTMLInputElement>;
};

describe("fileInputHandler", () => {
  it("선택한 파일을 기존 배열 뒤에 이어 붙인다", () => {
    const a = createPng("a.png");
    const b = createPng("b.png");
    const setImages = jest.fn();
    const e = createFileChangeEvent([a, b]);

    fileInputHandler(e, [], setImages);

    const updater = setImages.mock.calls[0][0] as (prev: File[]) => File[];
    expect(updater([])).toEqual([a, b]);
  });

  it("e.target.value를 비워 연속으로 같은 파일을 선택할 수 있게 한다", () => {
    const f = createPng("x.png");
    const e = createFileChangeEvent([f]);
    const setImages = jest.fn();

    fileInputHandler(e, [], setImages);

    expect(e.target.value).toBe("");
  });

  it("e.target.files가 없으면 setState를 호출하지 않는다", () => {
    const setImages = jest.fn();
    const e = { target: { files: null, value: "" } } as unknown as ChangeEvent<HTMLInputElement>;

    fileInputHandler(e, [], setImages);

    expect(setImages).not.toHaveBeenCalled();
  });

  it("기존 이미지 수와 합쳐 최대 5개를 넘지 않도록 새로 고른 파일만 잘라 낸다", () => {
    const existing = [createPng("1.png"), createPng("2.png"), createPng("3.png")];
    const n4 = createPng("4.png");
    const n5 = createPng("5.png");
    const n6 = createPng("6.png");
    const setImages = jest.fn();
    const e = createFileChangeEvent([n4, n5, n6]);

    fileInputHandler(e, existing, setImages);

    const updater = setImages.mock.calls[0][0] as (prev: File[]) => File[];
    expect(updater(existing)).toHaveLength(5);
    expect(updater(existing).slice(0, 3)).toEqual(existing);
    expect(updater(existing).slice(3)).toEqual([n4, n5]);
  });

  it("이미 5장이면 새로 고른 파일이 모두 잘려 state가 늘지 않는다", () => {
    const full = [1, 2, 3, 4, 5].map((i) => createPng(`${i}.png`));
    const setImages = jest.fn();
    const e = createFileChangeEvent([createPng("extra.png")]);

    fileInputHandler(e, full, setImages);

    const updater = setImages.mock.calls[0][0] as (prev: File[]) => File[];
    expect(updater(full)).toEqual(full);
  });
});
