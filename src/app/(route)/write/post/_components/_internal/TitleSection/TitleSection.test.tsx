import { render, screen } from "@testing-library/react";
import TitleSection from "./TitleSection";

jest.mock("@/components/common", () => ({
  RequiredText: () => <span data-testid="required-text">*</span>,
}));

const mockOnChange = jest.fn();
let mockFieldValue = "";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    control: {},
  }),
  Controller: ({
    render: renderProp,
    rules,
  }: {
    render: Function;
    rules?: object;
    name: string;
    control: object;
  }) => {
    return renderProp({
      field: {
        name: "title",
        value: mockFieldValue,
        onChange: mockOnChange,
        onBlur: jest.fn(),
        ref: jest.fn(),
      },
      fieldState: {},
      formState: {},
    });
  },
}));

describe("TitleSection", () => {
  beforeEach(() => {
    mockFieldValue = "";
    mockOnChange.mockClear();
  });

  it("제목 입력 섹션이 렌더링되어야 한다", () => {
    render(<TitleSection />);
    expect(screen.getByText("제목을 입력해 주세요.")).toBeInTheDocument();
  });

  it("제목 입력 input이 존재해야 한다", () => {
    render(<TitleSection />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("라벨 텍스트와 RequiredText가 함께 표시되어야 한다", () => {
    render(<TitleSection />);

    const labelText = screen.getByText("제목을 입력해 주세요.");
    expect(labelText).toBeInTheDocument();

    const required = screen.getByTestId("required-text");
    expect(required).toBeInTheDocument();
  });

  it("사용자가 입력을 시작하여 값이 생기면 라벨이 사라져야 한다", async () => {
    mockFieldValue = "테스트 제목";
    render(<TitleSection />);

    const labelText = screen.queryByText("제목을 입력해 주세요.");
    expect(labelText).not.toBeInTheDocument();
  });
});
