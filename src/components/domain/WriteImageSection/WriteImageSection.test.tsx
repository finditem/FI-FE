import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/providers/ToastProviders";
import { FormProvider, useForm } from "react-hook-form";
import { PostWriteFormValues } from "@/app/[locale]/(route)/write/post/_types/PostWriteType";
import WriteImageSection from "./WriteImageSection";

const renderWithProviders = (ui: React.ReactElement) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<PostWriteFormValues>({
      defaultValues: {
        images: [],
        tempPostId: null,
        temporarySave: false,
        postType: "",
        title: "",
        content: "",
        category: "",
        address: "",
        latitude: null,
        longitude: null,
        radius: null,
      },
    });

    return (
      <ToastProvider>
        <FormProvider {...methods}>{children}</FormProvider>
      </ToastProvider>
    );
  };

  return render(ui, { wrapper: Wrapper });
};

jest.mock("@/components/common", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}));

jest.mock("./_internal/ImagePreviewList", () => ({
  __esModule: true,
  default: () => <div data-testid="image-preview-list" />,
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock");
});

describe("WriteImageSection", () => {
  it("섹션이 렌더링되어야 한다", () => {
    renderWithProviders(<WriteImageSection />);
    expect(screen.getByLabelText("이미지 업로드")).toBeInTheDocument();
  });

  it("카메라 아이콘과 (0/5) 텍스트가 보여야 한다", () => {
    renderWithProviders(<WriteImageSection />);
    expect(screen.getByTestId("icon-Camera")).toBeInTheDocument();
    expect(screen.getByText("(0/5)")).toBeInTheDocument();
  });

  it("안내 문구가 보여야 한다", () => {
    renderWithProviders(<WriteImageSection />);
    expect(
      screen.getByText("최대 10MB, 총 5장의 이미지를 첨부할 수 있습니다. (jpg, jpeg, png)")
    ).toBeInTheDocument();
  });

  it("박스를 클릭하면 숨겨진 file input의 click이 호출되어야 한다", async () => {
    const { container } = renderWithProviders(<WriteImageSection />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(fileInput, "click");

    const uploadButton = screen.getByRole("button", { name: "이미지 업로드" });
    await userEvent.click(uploadButton);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("file input은 이미지 확장자만 허용해야 한다", () => {
    const { container } = renderWithProviders(<WriteImageSection />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute("accept", "image/png, image/jpeg, image/jpg");
  });
});
