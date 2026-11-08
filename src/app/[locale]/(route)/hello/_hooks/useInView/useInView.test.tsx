import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useInView } from "./useInView";

type IOCallback = IntersectionObserverCallback;

describe("useInView", () => {
  let ioCallback: IOCallback;
  let observeMock: jest.Mock;
  let disconnectMock: jest.Mock;

  beforeEach(() => {
    observeMock = jest.fn();
    disconnectMock = jest.fn();

    global.IntersectionObserver = jest.fn((callback: IOCallback) => {
      ioCallback = callback;

      return {
        observe: observeMock,
        unobserve: jest.fn(),
        disconnect: disconnectMock,
        takeRecords: jest.fn(),
        root: null,
        rootMargin: "0px",
        thresholds: [],
      } as unknown as IntersectionObserver;
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = ({ options }: { options?: IntersectionObserverInit }) => {
    const { ref, inView } = useInView(options);

    return (
      <div>
        <div data-testid="target" ref={ref as unknown as React.RefObject<HTMLDivElement>} />
        <span data-testid="state">{inView ? "true" : "false"}</span>
      </div>
    );
  };

  const makeEntry = (target: Element, isIntersecting: boolean): IntersectionObserverEntry =>
    ({
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      },
      isIntersecting,
      rootBounds: null,
      target,
      time: 0,
    }) as unknown as IntersectionObserverEntry;

  it("초기에는 inView가 false이다", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("state")).toHaveTextContent("false");
  });

  it("마운트 시 observe가 호출된다", () => {
    render(<TestComponent />);
    expect(observeMock).toHaveBeenCalled();
  });

  it("타겟이 intersect 되면 inView가 true로 변경된다", () => {
    render(<TestComponent />);

    const target = screen.getByTestId("target");

    act(() => {
      ioCallback([makeEntry(target, true)], {} as IntersectionObserver);
    });

    expect(screen.getByTestId("state")).toHaveTextContent("true");
  });

  it("한 번 intersect 되면 observer가 disconnect 된다", () => {
    render(<TestComponent />);

    const target = screen.getByTestId("target");

    act(() => {
      ioCallback([makeEntry(target, true)], {} as IntersectionObserver);
    });

    expect(disconnectMock).toHaveBeenCalled();
  });

  it("isIntersecting이 false면 inView는 변경되지 않는다", () => {
    render(<TestComponent />);

    const target = screen.getByTestId("target");

    act(() => {
      ioCallback([makeEntry(target, false)], {} as IntersectionObserver);
    });

    expect(screen.getByTestId("state")).toHaveTextContent("false");
    expect(disconnectMock).not.toHaveBeenCalled();
  });

  it("언마운트 시 observer가 disconnect 된다", () => {
    const { unmount } = render(<TestComponent />);

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });
});
