import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BaseNaverMap from "./BaseNaverMap";

const mockMapCenter = { x: 127.055972, y: 37.544583 };
const mockPanTo = jest.fn();
const mockMorph = jest.fn();

jest.mock("next-intl", () => ({
  useLocale: () => mockLocale,
}));

jest.mock("next/script", () => {
  const { useEffect } = jest.requireActual("react");
  return function MockScript({ src, onReady, onError }: any) {
    useEffect(() => {
      if (mockScriptLoadError) onError?.();
      else onReady?.();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return <script data-testid="naver-map-script" data-src={src} />;
  };
});

jest.mock("react-naver-maps", () => ({
  NavermapsProvider: ({ children }: any) => children,
  Container: ({ children }: any) => {
    if (mockContainerError) throw mockContainerError;
    return children;
  },
  NaverMap: ({ ref, children, onDragend, onZoomChanged }: any) => {
    ref.current = {
      getCenter: () => mockMapCenter,
      getZoom: () => 14,
      panTo: mockPanTo,
      morph: mockMorph,
    };
    return (
      <div data-testid="naver-map">
        <button type="button" onClick={onDragend}>
          drag end
        </button>
        <button type="button" onClick={() => onZoomChanged?.(15)}>
          zoom change
        </button>
        {children}
      </div>
    );
  },
  Marker: ({ position, icon, onClick }: any) => (
    <button
      type="button"
      data-testid="map-marker"
      data-position={`${position.lat},${position.lng}`}
      data-icon={icon.url}
      onClick={onClick}
    />
  ),
  Circle: ({ radius, center }: any) => (
    <div
      data-testid="map-circle"
      data-radius={radius}
      data-center={`${center.lat},${center.lng}`}
    />
  ),
  CustomOverlay: ({ children }: any) => <div data-testid="custom-overlay">{children}</div>,
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

jest.mock("@/api/fetch/mapController", () => ({}));

jest.mock("@/components/domain/BaseKakaoMap/MAP_MARKER_ICON", () => ({
  MAP_MARKER_ICON: { LOST: "/lost.svg", FOUND: "/found.svg" },
}));

jest.mock("@/components/domain/BaseKakaoMap/_internal", () => ({
  MapLoadingState: () => <div data-testid="map-loading-state" />,
  MapErrorState: () => <div data-testid="map-error-state" />,
}));

let mockContainerError: Error | null = null;
let mockLocale = "ko";
let mockScriptLoadError = false;
const center = { lat: 37.5665, lng: 126.978 };

describe("<BaseNaverMap />", () => {
  afterEach(() => {
    mockContainerError = null;
    mockLocale = "ko";
    mockScriptLoadError = false;
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

  it("markerData가 있으면 게시글 종류에 맞는 아이콘으로 마커를 렌더링합니다.", () => {
    const markerData = [
      { postId: 1, latitude: 37.5, longitude: 126.9, postType: "LOST" },
      { postId: 2, latitude: 37.6, longitude: 127.0, postType: "FOUND" },
    ] as any;
    render(<BaseNaverMap center={center} markerData={markerData} />);

    const icons = screen.getAllByTestId("map-marker").map((el) => el.dataset.icon);
    expect(icons).toEqual(["/lost.svg", "/found.svg"]);
  });

  it("markerData가 있으면 showCenterMarker가 true여도 중심 마커를 렌더링하지 않습니다.", () => {
    const markerData = [{ postId: 1, latitude: 37.5, longitude: 126.9, postType: "LOST" }] as any;
    render(<BaseNaverMap center={center} showCenterMarker markerData={markerData} />);
    expect(screen.getAllByTestId("map-marker")).toHaveLength(1);
  });

  it("게시글 마커를 누르면 postId와 좌표를 onMarkerClick으로 전달합니다.", () => {
    const onMarkerClick = jest.fn();
    const markerData = [{ postId: 7, latitude: 37.5, longitude: 126.9, postType: "LOST" }] as any;
    render(<BaseNaverMap center={center} markerData={markerData} onMarkerClick={onMarkerClick} />);

    fireEvent.click(screen.getByTestId("map-marker"));

    expect(onMarkerClick).toHaveBeenCalledWith(7, { lat: 37.5, lng: 126.9 });
  });

  it("placeMarkerData가 있으면 장소 마커를 개수만큼 렌더링하고, 누르면 placeId를 전달합니다.", () => {
    const onPlaceMarkerClick = jest.fn();
    const placeMarkerData = [
      { placeId: 1, latitude: 37.5, longitude: 127.0, type: "POPUP", thumbnailUrl: "/a.jpg" },
      { placeId: 2, latitude: 37.6, longitude: 127.1, type: "CAFE", thumbnailUrl: "/b.jpg" },
    ] as any;
    render(
      <BaseNaverMap
        center={center}
        placeMarkerData={placeMarkerData}
        selectedPlaceId={2}
        onPlaceMarkerClick={onPlaceMarkerClick}
      />
    );

    const placeMarkers = screen.getAllByTestId("custom-overlay");
    expect(placeMarkers).toHaveLength(2);
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { pressed: true }));
    expect(onPlaceMarkerClick).toHaveBeenCalledWith(2, { lat: 37.6, lng: 127.1 });
  });

  it("userLocation이 있으면 사용자 위치 마커를 렌더링하고, userHeading 방향으로 회전시킵니다.", () => {
    const { container } = render(
      <BaseNaverMap center={center} userLocation={{ lat: 37.5, lng: 127.0 }} userHeading={0} />
    );
    expect(container.querySelector('img[src*="user-location"]')?.getAttribute("style")).toContain(
      "rotate(-311.6deg)"
    );
  });

  it("userLocation이 없으면 사용자 위치 마커를 렌더링하지 않습니다.", () => {
    const { container } = render(<BaseNaverMap center={center} />);
    expect(container.querySelector('img[src*="user-location"]')).not.toBeInTheDocument();
  });

  it("innerRadius와 circleCenter를 주면 그 좌표에 바깥 원과 안쪽 원을 함께 그립니다.", () => {
    const circleCenter = { lat: 37.544583, lng: 127.055972 };
    render(
      <BaseNaverMap
        center={center}
        showCircle
        radius={500}
        innerRadius={250}
        circleCenter={circleCenter}
      />
    );

    const circles = screen.getAllByTestId("map-circle");
    expect(circles.map((el) => el.dataset.radius)).toEqual(["500", "250"]);
    expect(circles.map((el) => el.dataset.center)).toEqual([
      "37.544583,127.055972",
      "37.544583,127.055972",
    ]);
  });

  it("줌이 바뀌면 onZoomChange로 새 줌을 전달합니다.", () => {
    const onZoomChange = jest.fn();
    render(<BaseNaverMap center={center} onZoomChange={onZoomChange} />);

    fireEvent.click(screen.getByRole("button", { name: "zoom change" }));

    expect(onZoomChange).toHaveBeenCalledWith(15);
  });

  it("center가 바뀌면 순간 이동 대신 panTo로 미끄러지듯 이동합니다.", () => {
    const { rerender } = render(<BaseNaverMap center={center} />);
    const nextCenter = { lat: 37.5471, lng: 127.0474 };

    rerender(<BaseNaverMap center={nextCenter} />);

    expect(mockPanTo).toHaveBeenLastCalledWith(nextCenter);
  });

  it("사용자가 줌해 지도 줌과 zoom이 같아지면, center가 그대로일 때 예전 중심으로 되돌리지 않습니다.", () => {
    const { rerender } = render(<BaseNaverMap center={center} zoom={15} />);
    mockPanTo.mockClear();
    mockMorph.mockClear();

    rerender(<BaseNaverMap center={center} zoom={14} />);

    expect(mockPanTo).not.toHaveBeenCalled();
    expect(mockMorph).not.toHaveBeenCalled();
  });

  it("드래그 후 부모가 같은 좌표를 center로 돌려주면 panTo하지 않습니다.", () => {
    const { rerender } = render(<BaseNaverMap center={center} />);
    fireEvent.click(screen.getByRole("button", { name: "drag end" }));
    mockPanTo.mockClear();

    rerender(<BaseNaverMap center={{ lat: mockMapCenter.y, lng: mockMapCenter.x }} />);

    expect(mockPanTo).not.toHaveBeenCalled();
  });

  it("zoom이 바뀌면 이동과 줌을 morph로 한 번에 처리합니다.", () => {
    const { rerender } = render(<BaseNaverMap center={center} zoom={14} />);
    const nextCenter = { lat: 37.5471, lng: 127.0474 };

    rerender(<BaseNaverMap center={nextCenter} zoom={15} />);

    expect(mockMorph).toHaveBeenLastCalledWith(nextCenter, 15);
  });

  it("현재 언어를 붙여 네이버 지도 스크립트를 로드합니다.", () => {
    mockLocale = "en";
    render(<BaseNaverMap center={center} />);

    const src = screen.getByTestId("naver-map-script").getAttribute("data-src");
    expect(src).toContain("language=en");
    expect(src).toContain("submodules=geocoder");
  });

  it("스크립트 로드에 실패하면 MapErrorState를 렌더링합니다.", () => {
    mockScriptLoadError = true;
    render(<BaseNaverMap center={center} />);

    expect(screen.getByTestId("map-error-state")).toBeInTheDocument();
    expect(screen.queryByTestId("naver-map")).not.toBeInTheDocument();
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
