import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MyLocationButton from "./MyLocationButton";
import { useMyLocationButton } from "../../_hooks";

jest.mock("../../_hooks", () => ({
  useMyLocationButton: jest.fn(),
}));

jest.mock("../PermissionBottomSheet/PermissionBottomSheet", () => ({
  LocationPermissionBottomSheet: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="location-permission-sheet">
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    ) : null,
}));

const mockUseMyLocationButton = useMyLocationButton as jest.MockedFunction<
  typeof useMyLocationButton
>;

describe("<MyLocationButton />", () => {
  beforeEach(() => {
    mockUseMyLocationButton.mockReturnValue({
      handleMyLocationClick: jest.fn(),
      isLocationPermissionSheetOpen: false,
      closeLocationPermissionSheet: jest.fn(),
    });
  });

  it("내 위치 버튼을 노출하고 접근 가능한 이름을 가진다.", () => {
    render(<MyLocationButton />);

    expect(screen.getByRole("button", { name: "내 위치로 이동" })).toBeInTheDocument();
  });

  it("클릭 시 handleMyLocationClick을 호출한다.", async () => {
    const user = userEvent.setup();
    const handleMyLocationClick = jest.fn();
    mockUseMyLocationButton.mockReturnValue({
      handleMyLocationClick,
      isLocationPermissionSheetOpen: false,
      closeLocationPermissionSheet: jest.fn(),
    });

    render(<MyLocationButton />);
    await user.click(screen.getByRole("button", { name: "내 위치로 이동" }));

    expect(handleMyLocationClick).toHaveBeenCalled();
  });

  it("위치 권한 시트가 열리면 LocationPermissionBottomSheet를 렌더링한다.", () => {
    mockUseMyLocationButton.mockReturnValue({
      handleMyLocationClick: jest.fn(),
      isLocationPermissionSheetOpen: true,
      closeLocationPermissionSheet: jest.fn(),
    });

    render(<MyLocationButton />);

    expect(screen.getByTestId("location-permission-sheet")).toBeInTheDocument();
  });
});
