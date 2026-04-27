import { renderHook, waitFor } from "@testing-library/react";

import useObjectURLs from "./useObjectURLs";

const EMPTY_FILES: File[] = [];

describe("useObjectURLs", () => {
  const originalCreate = global.URL.createObjectURL;
  const originalRevoke = global.URL.revokeObjectURL;

  beforeAll(() => {
    let seq = 0;
    global.URL.createObjectURL = jest.fn(() => `blob:unit-${++seq}`);
    global.URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    global.URL.createObjectURL = originalCreate;
    global.URL.revokeObjectURL = originalRevoke;
  });

  beforeEach(() => {
    jest.mocked(URL.createObjectURL).mockClear();
    jest.mocked(URL.revokeObjectURL).mockClear();
  });

  it("빈 배열이면 URL 배열도 빈 배열이다", async () => {
    const { result } = renderHook(() => useObjectURLs(EMPTY_FILES));

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("빈 배열 리터럴을 넘겨도 무한 갱신되지 않고 빈 배열을 유지한다", async () => {
    const { result } = renderHook(() => useObjectURLs([]));

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("File마다 blob URL을 만들고 길이가 같다", async () => {
    const files = [
      new File(["a"], "a.png", { type: "image/png" }),
      new File(["b"], "b.png", { type: "image/png" }),
    ];

    const { result } = renderHook(() => useObjectURLs(files));

    await waitFor(() => {
      expect(result.current).toHaveLength(2);
    });

    result.current.forEach((url) => {
      expect(url).toMatch(/^blob:/);
    });

    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
  });

  it("언마운트 시 생성한 URL을 revoke한다", async () => {
    const file = new File(["x"], "x.png", { type: "image/png" });
    const files = [file];
    const { result, unmount } = renderHook(() => useObjectURLs(files));

    await waitFor(() => {
      expect(result.current).toHaveLength(1);
    });

    const url = result.current[0];
    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(url);
  });

  it("images가 바뀌면 이전 URL을 revoke하고 새 URL을 만든다", async () => {
    const f1 = new File(["1"], "1.png", { type: "image/png" });
    const f2 = new File(["2"], "2.png", { type: "image/png" });

    const { result, rerender } = renderHook(
      ({ files }: { files: File[] }) => useObjectURLs(files),
      {
        initialProps: { files: [f1] },
      }
    );

    await waitFor(() => {
      expect(result.current).toHaveLength(1);
    });

    const firstUrl = result.current[0];

    rerender({ files: [f2] });

    await waitFor(() => {
      expect(result.current).toHaveLength(1);
      expect(result.current[0]).not.toBe(firstUrl);
    });

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(firstUrl);
  });

  it("파일이 있던 상태에서 빈 배열로 바꾸면 URL을 비우고 revoke한다", async () => {
    const file = new File(["x"], "x.png", { type: "image/png" });
    const { result, rerender } = renderHook(
      ({ files }: { files: File[] }) => useObjectURLs(files),
      {
        initialProps: { files: [file] },
      }
    );

    await waitFor(() => {
      expect(result.current).toHaveLength(1);
    });

    const prev = result.current[0];
    rerender({ files: EMPTY_FILES });

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(prev);
  });

  it("런타임에서 images가 null이면 빈 URL 배열로 맞춘다", async () => {
    const { result } = renderHook(() => useObjectURLs(null as unknown as File[]));

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });
});
