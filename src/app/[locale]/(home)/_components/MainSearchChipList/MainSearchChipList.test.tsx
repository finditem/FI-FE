import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { PLACE_FILTER_PARAM, PLACE_ID_PARAM } from "../HOME_CONST";
import MainSearchChipList from "./MainSearchChipList";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/hooks", () => ({
  useHorizontalDragScroll: () => ({ ref: { current: null }, onMouseDown: jest.fn() }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const mockPush = jest.fn();
const mockUseSearchParams = useSearchParams as jest.Mock;

const parseQueryPath = (path: string) => new URLSearchParams(path.split("?")[1] ?? "");

describe("<MainSearchChipList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("다른 장소 칩으로 전환하면 이전에 선택한 장소의 place-id를 지운다", async () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams(`${PLACE_FILTER_PARAM}=popup&${PLACE_ID_PARAM}=7`)
    );

    render(<MainSearchChipList />);
    await userEvent.click(screen.getByRole("button", { name: "cafe" }));

    const params = parseQueryPath(mockPush.mock.calls[0][0]);
    expect(params.get(PLACE_FILTER_PARAM)).toBe("cafe");
    expect(params.has(PLACE_ID_PARAM)).toBe(false);
  });

  it("선택된 장소 칩을 다시 눌러 해제하면 place-id도 함께 지운다", async () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams(`${PLACE_FILTER_PARAM}=popup&${PLACE_ID_PARAM}=7`)
    );

    render(<MainSearchChipList />);
    await userEvent.click(screen.getByRole("button", { name: "popup" }));

    expect(mockPush.mock.calls[0][0]).toBe("/");
  });
});
