import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BaseNaverMap from "./BaseNaverMap";

const mockMapCenter = { x: 127.055972, y: 37.544583 };

jest.mock("react-naver-maps", () => ({
  NavermapsProvider: ({ children }: any) => children,
  Container: ({ children }: any) => {
    if (mockContainerError) throw mockContainerError;
    return children;
  },
  NaverMap: ({ ref, children, onDragend }: any) => {
    ref.current = { getCenter: () => mockMapCenter };
    return (
      <div data-testid="naver-map">
        <button type="button" onClick={onDragend}>
          drag end
        </button>
        {children}
      </div>
    );
  },
  Marker: ({ position }: any) => (
    <div data-testid="map-marker" data-position={`${position.lat},${position.lng}`} />
  ),
  Circle: ({ radius }: any) => <div data-testid="map-circle" data-radius={radius} />,
}));

jest.mock("@/app/ErrorBoundary", () => {
  const { Component } = jest.requireActual("react");
  class MockErrorBoundary extends Component<any, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    render() {
      return this.state.hasError ? this.props.fallback : this.props.children;
    }
  }
  return { ErrorBoundary: MockErrorBoundary };
});

jest.mock("@/components/domain/BaseKakaoMap/_internal", () => ({
  MapLoadingState: () => <div data-testid="map-loading-state" />,
  MapErrorState: () => <div data-testid="map-error-state" />,
}));

let mockContainerError: Error | null = null;
const center = { lat: 37.5665, lng: 126.978 };

describe("<BaseNaverMap />", () => {
  afterEach(() => {
    mockContainerError = null;
  });

  it("지도를 렌더링합니다.", () => {
    render(<BaseNaverMap center={center} />);
    expect(screen.getByTestId("naver-map")).toBeInTheDocument();
  });

  it("SDK 로딩에 실패하면 MapErrorState를 렌더링합니다.", () => {
    mockContainerError = new Error("load error");
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<BaseNaverMap center={center} />);

    expect(screen.getByTestId("map-error-state")).toBeInTheDocument();
    jest.mocked(console.error).mockRestore();
  });

  it("showCircle이 true이고 radius가 있으면 Circle을 렌더링합니다.", () => {
    render(<BaseNaverMap center={center} showCircle radius={500} />);
    expect(screen.getByTestId("map-circle")).toHaveAttribute("data-radius", "500");
  });

  it("showCircle이 true여도 radius가 없으면 Circle을 렌더링하지 않습니다.", () => {
    render(<BaseNaverMap center={center} showCircle />);
    expect(screen.queryByTestId("map-circle")).not.toBeInTheDocument();
  });

  it("showCenterMarker가 true이면 중심 좌표에 마커를 렌더링합니다.", () => {
    render(<BaseNaverMap center={center} showCenterMarker />);
    expect(screen.getByTestId("map-marker")).toHaveAttribute("data-position", "37.5665,126.978");
  });

  it("드래그가 끝나면 지도의 새 중심 좌표를 onDragEnd로 전달하고 중심 마커를 옮깁니다.", () => {
    const onDragEnd = jest.fn();
    render(<BaseNaverMap center={center} showCenterMarker onDragEnd={onDragEnd} />);

    fireEvent.click(screen.getByRole("button", { name: "drag end" }));

    expect(onDragEnd).toHaveBeenCalledWith({ lat: 37.544583, lng: 127.055972 });
    expect(screen.getByTestId("map-marker")).toHaveAttribute(
      "data-position",
      "37.544583,127.055972"
    );
  });

  it("children이 지도 위에 렌더링됩니다.", () => {
    render(
      <BaseNaverMap center={center}>
        <div data-testid="overlay">오버레이 UI</div>
      </BaseNaverMap>
    );
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });
});
