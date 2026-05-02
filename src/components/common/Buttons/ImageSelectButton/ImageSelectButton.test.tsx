import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleImageButton from "./ImageSelectButton";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockUseObjectURLs = jest.fn((_files: File[]) => [] as string[]);

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useObjectURLs: (files: File[]) => mockUseObjectURLs(files),
}));

jest.mock("@/components/common/Icon/Icon", () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

jest.mock("@/utils", () => {
  const actual = jest.requireActual("@/utils");
  return {
    ...actual,
    fileInputHandler: jest.fn(),
  };
});

describe("ToggleImageButton (ImageSelectButton)", () => {
  const file = new File([""], "a.png", { type: "image/png" });

  beforeEach(() => {
    mockUseObjectURLs.mockImplementation((files: File[]) => files.map((_, i) => `blob:mock-${i}`));
  });

  it("role=group과 aria-label이 설정됩니다", () => {
    render(
      <ToggleImageButton
        ariaLabel="이미지 선택"
        images={[]}
        setImages={jest.fn()}
        selectedImages={[]}
        setSelectedImages={jest.fn()}
      />
    );
    expect(screen.getByRole("group", { name: "이미지 선택" })).toBeInTheDocument();
  });

  it("이미지가 있으면 썸네일 버튼이 렌더링되고 클릭 시 setSelectedImages가 호출됩니다", async () => {
    const user = userEvent.setup();
    const setSelectedImages = jest.fn();
    render(
      <ToggleImageButton
        images={[file]}
        setImages={jest.fn()}
        selectedImages={[]}
        setSelectedImages={setSelectedImages}
      />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const thumbnailButton = buttons[1];
    await user.click(thumbnailButton);
    expect(setSelectedImages).toHaveBeenCalled();
  });

  it("images가 5개 이상이면 첨부 입력이 비활성화됩니다", () => {
    const files = Array.from(
      { length: 5 },
      (_, i) => new File([""], `${i}.png`, { type: "image/png" })
    );
    render(
      <ToggleImageButton
        images={files}
        setImages={jest.fn()}
        selectedImages={[]}
        setSelectedImages={jest.fn()}
      />
    );
    expect(screen.getByLabelText("이미지 첨부")).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("group").querySelector('input[type="file"]')).toBeDisabled();
  });
});
