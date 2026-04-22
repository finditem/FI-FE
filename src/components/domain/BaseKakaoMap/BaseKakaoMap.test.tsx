import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BaseKakaoMap from "./BaseKakaoMap";

jest.mock("react-kakao-maps-sdk", () => ({
  useKakaoLoader: jest.fn(),
  Map: ({ children }: any) => <div data-testid="kakao-map">{children}</div>,
  MapMarker: () => <div data-testid="map-marker" />,
  Circle: ({ radius }: any) => <div data-testid="map-circle" data-radius={radius} />,
}));

jest.mock("@/components/domain/BaseKakaoMap/_internal", () => ({
  MapLoadingState: () => <div data-testid="map-loading-state" />,
  MapErrorState: () => <div data-testid="map-error-state" />,
}));

jest.mock("@/api/fetch/mapController", () => ({}));

jest.mock("./MAP_MARKER_ICON", () => ({
  MAP_MARKER_ICON: { LOST: "/lost.svg", FOUND: "/found.svg" },
}));

const { useKakaoLoader } = jest.requireMock("react-kakao-maps-sdk");
const center = { lat: 37.5665, lng: 126.978 };

describe("<BaseKakaoMap />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("로딩 중이면 MapLoadingState를 렌더링합니다.", () => {
    useKakaoLoader.mockReturnValue([true, null]);
    render(<BaseKakaoMap center={center} />);
    expect(screen.getByTestId("map-loading-state")).toBeInTheDocument();
  });

  it("에러 발생 시 MapErrorState를 렌더링합니다.", () => {
    useKakaoLoader.mockReturnValue([false, new Error("load error")]);
    render(<BaseKakaoMap center={center} />);
    expect(screen.getByTestId("map-error-state")).toBeInTheDocument();
  });

  it("로드 완료 시 지도를 렌더링합니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    render(<BaseKakaoMap center={center} />);
    expect(screen.getByTestId("kakao-map")).toBeInTheDocument();
  });

  it("showCircle이 true이고 radius가 있으면 Circle을 렌더링합니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    render(<BaseKakaoMap center={center} showCircle radius={500} />);
    expect(screen.getByTestId("map-circle")).toBeInTheDocument();
  });

  it("showCircle이 true여도 radius가 없으면 Circle을 렌더링하지 않습니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    render(<BaseKakaoMap center={center} showCircle />);
    expect(screen.queryByTestId("map-circle")).not.toBeInTheDocument();
  });

  it("showCenterMarker가 true이고 markerData가 없으면 중심 마커를 렌더링합니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    render(<BaseKakaoMap center={center} showCenterMarker />);
    expect(screen.getByTestId("map-marker")).toBeInTheDocument();
  });

  it("markerData가 있으면 해당 마커 수만큼 렌더링합니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    const markerData = [
      { postId: 1, latitude: 37.5, longitude: 126.9, postType: "LOST" },
      { postId: 2, latitude: 37.6, longitude: 127.0, postType: "FOUND" },
    ] as any;
    render(<BaseKakaoMap center={center} markerData={markerData} />);
    expect(screen.getAllByTestId("map-marker")).toHaveLength(2);
  });

  it("markerData가 있으면 showCenterMarker가 true여도 중심 마커를 렌더링하지 않습니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    const markerData = [{ postId: 1, latitude: 37.5, longitude: 126.9, postType: "LOST" }] as any;
    render(<BaseKakaoMap center={center} showCenterMarker markerData={markerData} />);
    expect(screen.getAllByTestId("map-marker")).toHaveLength(1);
  });

  it("children이 지도 위에 렌더링됩니다.", () => {
    useKakaoLoader.mockReturnValue([false, null]);
    render(
      <BaseKakaoMap center={center}>
        <div data-testid="overlay">오버레이 UI</div>
      </BaseKakaoMap>
    );
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });
});
