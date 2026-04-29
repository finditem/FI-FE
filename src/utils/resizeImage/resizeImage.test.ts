import { resizeImage } from "./resizeImage";

const DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const createMockFile = (name = "photo.png") => {
  return new File([""], name, { type: "image/png" });
};

describe("resizeImage", () => {
  const OriginalFileReader = global.FileReader;
  const OriginalImage = global.Image;
  const originalCreateElement = document.createElement.bind(document);

  const mockCanvas: {
    toBlob: jest.Mock;
    getContext: jest.Mock;
  } = {
    toBlob: jest.fn(),
    getContext: jest.fn(),
  };

  const setupHappyPath = (imgW: number, imgH: number) => {
    class MockFileReader {
      onload: ((e: { target: { result: string } }) => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        queueMicrotask(() => {
          this.onload?.({ target: { result: DATA_URL } });
        });
      }
    }

    class MockImage {
      width = imgW;
      height = imgH;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        queueMicrotask(() => {
          this.onload?.();
        });
      }
    }

    global.FileReader = MockFileReader as any;
    global.Image = MockImage as any;

    mockCanvas.getContext.mockReturnValue({ drawImage: jest.fn() });
    mockCanvas.toBlob.mockImplementation((cb: (b: Blob | null) => void) => {
      cb(new Blob([new Uint8Array(64)], { type: "image/jpeg" }));
    });

    let cw = 0;
    let ch = 0;
    jest.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return {
          get width() {
            return cw;
          },
          set width(w: number) {
            cw = w;
          },
          get height() {
            return ch;
          },
          set height(h: number) {
            ch = h;
          },
          getContext: (ctx: string) => mockCanvas.getContext(ctx),
          toBlob: mockCanvas.toBlob,
        } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tag);
    });
  };

  afterEach(() => {
    global.FileReader = OriginalFileReader;
    global.Image = OriginalImage;
    jest.restoreAllMocks();
    mockCanvas.toBlob.mockReset();
    mockCanvas.getContext.mockReset();
  });

  it("성공 시 JPEG File을 반환하고 확장자는 .jpg", async () => {
    setupHappyPath(100, 100);
    const out = await resizeImage(createMockFile("icon.PNG"));
    expect(out.type).toBe("image/jpeg");
    expect(out.name).toBe("icon.jpg");
  });

  it("getContext가 null이면 거부한다", async () => {
    setupHappyPath(10, 10);
    mockCanvas.getContext.mockReturnValue(null);
    await expect(resizeImage(createMockFile())).rejects.toThrow("Canvas context");
  });

  it("toBlob이 blob을 돌려주지 않으면 거부한다", async () => {
    setupHappyPath(10, 10);
    mockCanvas.toBlob.mockImplementation((cb: (b: Blob | null) => void) => {
      cb(null);
    });
    await expect(resizeImage(createMockFile())).rejects.toThrow("압축");
  });
});

describe("resizeImage (reader / image error)", () => {
  const OriginalFileReader = global.FileReader;
  const OriginalImage = global.Image;

  afterEach(() => {
    global.FileReader = OriginalFileReader;
    global.Image = OriginalImage;
  });

  it("FileReader onerror이면 파일 읽기 실패로 reject", async () => {
    class FailsReader {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        queueMicrotask(() => {
          this.onerror?.();
        });
      }
    }
    global.FileReader = FailsReader as any;
    global.Image = OriginalImage as any;

    await expect(resizeImage(createMockFile())).rejects.toThrow("파일을 읽을 수 없습니다");
  });

  it("Image onerror이면 이미지 로드 실패로 reject", async () => {
    class OkReader {
      onload: ((e: { target: { result: string } }) => void) | null = null;
      readAsDataURL() {
        queueMicrotask(() => {
          this.onload?.({ target: { result: DATA_URL } });
        });
      }
    }
    class BadImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_: string) {
        queueMicrotask(() => {
          this.onerror?.();
        });
      }
    }

    global.FileReader = OkReader as any;
    global.Image = BadImage as any;

    await expect(resizeImage(createMockFile())).rejects.toThrow("이미지를 로드할 수 없습니다");
  });
});
