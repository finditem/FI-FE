import { act, renderHook, waitFor } from "@testing-library/react";

import { useGeolocationPermissionGranted } from "./useGeolocationPermissionGranted";

type MutablePermissionStatus = {
  state: PermissionState;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
};

const defineNavigatorPermissions = (value: Permissions | undefined) => {
  Object.defineProperty(navigator, "permissions", {
    configurable: true,
    value,
    writable: true,
  });
};

describe("useGeolocationPermissionGranted", () => {
  let originalPermissions: Permissions | undefined;

  beforeEach(() => {
    originalPermissions = navigator.permissions;
  });

  afterEach(() => {
    defineNavigatorPermissions(originalPermissions);
  });

  it("navigator.permissions가 없으면 false를 반환한다", async () => {
    defineNavigatorPermissions(undefined);

    const { result } = renderHook(() => useGeolocationPermissionGranted());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("권한이 granted이면 true를 반환한다", async () => {
    const status: MutablePermissionStatus = {
      state: "granted",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    defineNavigatorPermissions({
      query: jest.fn().mockResolvedValue(status),
    } as unknown as Permissions);

    const { result } = renderHook(() => useGeolocationPermissionGranted());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("권한이 prompt이면 false를 반환한다", async () => {
    const status: MutablePermissionStatus = {
      state: "prompt",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    defineNavigatorPermissions({
      query: jest.fn().mockResolvedValue(status),
    } as unknown as Permissions);

    const { result } = renderHook(() => useGeolocationPermissionGranted());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("권한이 denied이면 false를 반환한다", async () => {
    const status: MutablePermissionStatus = {
      state: "denied",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    defineNavigatorPermissions({
      query: jest.fn().mockResolvedValue(status),
    } as unknown as Permissions);

    const { result } = renderHook(() => useGeolocationPermissionGranted());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("change 이벤트 후 state가 granted가 되면 true로 갱신된다", async () => {
    let changeHandler: EventListener | null = null;

    const status: MutablePermissionStatus = {
      state: "prompt",
      addEventListener(type, listener) {
        if (type === "change") changeHandler = listener;
      },
      removeEventListener: jest.fn(),
    };

    defineNavigatorPermissions({
      query: jest.fn().mockResolvedValue(status),
    } as unknown as Permissions);

    const { result } = renderHook(() => useGeolocationPermissionGranted());

    await waitFor(() => {
      expect(changeHandler).not.toBeNull();
    });

    expect(result.current).toBe(false);

    status.state = "granted";
    act(() => {
      changeHandler?.(new Event("change"));
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("언마운트 시 change 리스너를 제거한다", async () => {
    let changeHandler: EventListener | null = null;

    const status: MutablePermissionStatus = {
      state: "granted",
      addEventListener(type, listener) {
        if (type === "change") changeHandler = listener;
      },
      removeEventListener: jest.fn(),
    };

    defineNavigatorPermissions({
      query: jest.fn().mockResolvedValue(status),
    } as unknown as Permissions);

    const { unmount } = renderHook(() => useGeolocationPermissionGranted());

    await waitFor(() => {
      expect(changeHandler).not.toBeNull();
    });

    unmount();

    expect(status.removeEventListener).toHaveBeenCalledWith("change", changeHandler);
  });
});
