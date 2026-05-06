import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PasswordConfirmSection from "./PasswordConfirmSection";

const mockWatch = jest.fn();
const mockGetValues = jest.fn();

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    watch: mockWatch,
    getValues: mockGetValues,
    formState: { errors: {} },
  }),
}));

jest.mock("@/components/common", () => ({
  InputText: ({ label }: any) => <div data-testid={`input-${label}`}>{label}</div>,
}));

describe("<PasswordConfirmSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWatch.mockReturnValue("");
    mockGetValues.mockReturnValue("");
  });

  it("'새 비밀번호' 입력 필드가 렌더된다", () => {
    render(<PasswordConfirmSection />);
    expect(screen.getByTestId("input-새 비밀번호")).toBeInTheDocument();
  });

  it("'새 비밀번호 확인' 입력 필드가 렌더된다", () => {
    render(<PasswordConfirmSection />);
    expect(screen.getByTestId("input-새 비밀번호 확인")).toBeInTheDocument();
  });
});
