"use client";

import { useEffect, useState } from "react";

/**
 * Geolocation 권한이 `granted`인지 여부를 구독해 반환하는 훅입니다.
 *
 * 위치 기반 기능(지도, 주변 검색 등) 진입 전 허용 여부를 UI에 반영할 때 사용합니다.
 *
 * @returns 권한이 `granted`이면 `true`, 그 외(`prompt`, `denied`)·미지원·SSR이면 `false`
 *
 * @remarks
 * - `navigator.permissions.query({ name: "geolocation" })`로 초기 상태를 읽고, `change` 이벤트로 이후 변경을 반영합니다.
 * - `typeof navigator === "undefined"`이면(SSR 등) 이펙트가 조기 종료되며, 초기값 `false`가 유지됩니다.
 * - `navigator.permissions`가 없으면 `false`로 맞춘 뒤 종료합니다.
 * - 마운트 해제 시 `change` 리스너를 제거합니다.
 *
 * @author hyungjun
 * /
 
/**
 * @example
 * ```tsx
 * const canUseGeolocation = useGeolocationPermissionGranted();
 * return canUseGeolocation ? <MapWithUserLocation /> : <LocationPermissionPrompt />;
 * ```
 */

export const useGeolocationPermissionGranted = () => {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    let cancelled = false;
    let permRef: PermissionStatus | null = null;
    const sync = () => {
      if (cancelled) return;
      setGranted(permRef?.state === "granted");
    };

    if (!navigator.permissions) {
      setGranted(false);
      return;
    }

    void navigator.permissions.query({ name: "geolocation" }).then((p) => {
      if (cancelled) return;
      permRef = p;
      sync();
      p.addEventListener("change", sync);
    });

    return () => {
      cancelled = true;
      permRef?.removeEventListener("change", sync);
    };
  }, []);

  return granted;
};
