import { render, screen } from "@testing-library/react";
import ContentSection from "./ContentSection";

jest.mock("@/components/common", () => ({
  RequiredText: () => <span data-testid="required-text">*</span>,
}));

let mockFieldValue = "";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    control: {},
  }),
  Controller: ({
    render: renderProp,
  }: {
    render: Function;
    name: string;
    control: object;
    rules?: object;
  }) => {
    return renderProp({
      field: {
        name: "content",
        value: mockFieldValue,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
      },
      fieldState: {},
      formState: {},
    });
  },
}));

describe("ContentSection", () => {
  beforeEach(() => {
    mockFieldValue = "";
  });

  it("내용 입력 섹션이 렌더링되어야 한다", () => {
    render(<ContentSection />);
    expect(screen.getByText("내용을 입력해 주세요.")).toBeInTheDocument();
  });

  it("라벨과 RequiredText가 표시되어야 한다", () => {
    render(<ContentSection />);
    expect(screen.getByText("내용을 입력해 주세요.")).toBeInTheDocument();
    expect(screen.getByTestId("required-text")).toBeInTheDocument();
  });

  it("textarea가 존재해야 한다", () => {
    render(<ContentSection />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("textarea의 rows 기본값은 5이어야 한다", () => {
    render(<ContentSection />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("값이 있으면 플레이스홀더 라벨이 사라져야 한다", () => {
    mockFieldValue = "테스트 내용";
    render(<ContentSection />);
    const labelText = screen.queryByText("내용을 입력해 주세요.");
    expect(labelText).not.toBeInTheDocument();
  });
});
