import { render, waitFor } from "@testing-library/react";
import useSectionHeights from "./useSectionHeights";

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

describe("useSectionHeights", () => {
  let offsetHeightSpy: jest.SpyInstance;
  let offsetTopSpy: jest.SpyInstance;

  beforeEach(() => {
    global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
    offsetHeightSpy = jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(50);
    offsetTopSpy = jest.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(10);
  });

  afterEach(() => {
    offsetHeightSpy.mockRestore();
    offsetTopSpy.mockRestore();
  });

  function Harness({ onMeasure }: { onMeasure: jest.Mock }) {
    const refs = useSectionHeights(onMeasure);
    return (
      <div>
        <div ref={refs.lostFindRef} data-testid="lost" />
        <div ref={refs.recentRef} data-testid="recent" />
        <div ref={refs.policeRef} data-testid="police" />
      </div>
    );
  }

  it("세 영역이 마운트되면 누적 높이 정보를 전달한다", async () => {
    const onMeasure = jest.fn();

    render(<Harness onMeasure={onMeasure} />);

    await waitFor(() => {
      expect(onMeasure).toHaveBeenCalledWith({
        upToLostFindActions: 60,
        upToRecentFoundItemSection: 60,
        upToPoliceSection: 60,
      });
    });
  });

  it("onSectionHeights가 없어도 마운트 오류가 나지 않는다", () => {
    function EmptyHarness() {
      const refs = useSectionHeights(undefined);
      return (
        <div>
          <div ref={refs.lostFindRef} />
          <div ref={refs.recentRef} />
          <div ref={refs.policeRef} />
        </div>
      );
    }

    expect(() => render(<EmptyHarness />)).not.toThrow();
  });
});
