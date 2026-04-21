"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  /** 설치 프롬프트 실행 함수 */
  prompt: () => Promise<void>;
  /** 사용자 선택 결과 (accepted: 설치 수락, dismissed: 거절) */
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAContextType {
  /** 설치 프롬프트 사용 가능 여부 */
  canInstall: boolean;
  /** 설치 유도 팝업 표시 여부 */
  showPrompt: boolean;
  /** PWA 설치 프롬프트를 실행하고 결과를 스토리지에 기록 */
  installApp: () => Promise<void>;
  /** 상세 페이지 조회 횟수를 증가시키고, 5회 도달 시 팝업 활성화 */
  incrementViewCount: () => void;
  /** 팝업을 닫고 다시 보지 않도록 설정 */
  closePrompt: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

const PWA_INFO_KEY = "fi-pwa-info";
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

interface PWAInfo {
  /** 상세 페이지 조회 횟수 */
  viewCount: number;
  /** 설치 유도 팝업 표시 여부 */
  hasShown: boolean;
  /** 저장 시작 시간 (Unix timestamp, 1개월 경과 시 초기화) */
  startDate: number;
}

const getPWAInfo = (): PWAInfo => {
  const stored = localStorage.getItem(PWA_INFO_KEY);
  if (!stored) return { viewCount: 0, hasShown: false, startDate: Date.now() };
  try {
    return JSON.parse(stored);
  } catch {
    return { viewCount: 0, hasShown: false, startDate: Date.now() };
  }
};

const setPWAInfo = (info: PWAInfo) => {
  localStorage.setItem(PWA_INFO_KEY, JSON.stringify(info));
};

/**
 * PWA 설치 프롬프트 상태를 관리하는 Context Provider 컴포넌트입니다.
 *
 * @remarks
 * - 상세 페이지를 5회 조회하면 설치 유도 팝업이 활성화됩니다.
 * - 팝업을 닫거나 설치하면 1개월간 다시 표시되지 않습니다.
 * - `usePWA` 훅을 통해 하위 컴포넌트에서 PWA 상태에 접근할 수 있습니다.
 *
 * @author jikwon
 */

export const PWAProvider = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. 구버전 키 삭제 및 만료 체크
    localStorage.removeItem("pwa-post-view-count");
    localStorage.removeItem("pwa-prompt-shown");
    localStorage.removeItem("pwa-storage-date");

    const info = getPWAInfo();
    const now = Date.now();

    if (now - info.startDate > ONE_MONTH_MS) {
      setPWAInfo({ viewCount: 0, hasShown: false, startDate: now });
    }

    // 2. PWA 설치 이벤트 핸들러
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const { viewCount, hasShown } = getPWAInfo();
    if (!hasShown && viewCount >= 5 && deferredPrompt) {
      setShowPrompt(true);
    }
  }, [deferredPrompt]);

  // 상세 페이지 조회 횟수를 증가시키고 5회 도달 시 팝업을 활성화합니다.
  const incrementViewCount = () => {
    const info = getPWAInfo();
    if (info.hasShown || info.viewCount >= 5) return;

    const newCount = info.viewCount + 1;
    setPWAInfo({ ...info, viewCount: newCount });

    if (newCount >= 5) {
      setShowPrompt(true);
    }
  };

  // PWA 설치 프롬프트를 실행하고 사용자의 선택 결과를 스토리지에 기록합니다.
  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      const info = getPWAInfo();
      setPWAInfo({ ...info, hasShown: true });
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // 팝업을 닫고 다시 보지 않도록 설정합니다.
  const closePrompt = () => {
    const info = getPWAInfo();
    setPWAInfo({ ...info, hasShown: true });
    setShowPrompt(false);
  };

  return (
    <PWAContext.Provider
      value={{
        canInstall: !!deferredPrompt,
        showPrompt,
        installApp,
        incrementViewCount,
        closePrompt,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

/**
 * PWA 설치 관련 상태와 핸들러를 제공하는 커스텀 훅입니다.
 *
 * @remarks
 * - `PWAProvider` 하위에서만 사용해야 합니다.
 *
 * @returns PWA 관련 상태 및 핸들러 객체
 * - `canInstall`: 설치 프롬프트 사용 가능 여부
 * - `showPrompt`: 설치 유도 팝업 표시 여부
 * - `installApp`: PWA 설치 프롬프트 실행 함수
 * - `incrementViewCount`: 상세 페이지 조회 횟수 증가 함수
 * - `closePrompt`: 팝업 닫기 및 재표시 방지 함수
 */
/**
 * @example
 * ```tsx
 * const { canInstall, showPrompt, installApp } = usePWA();
 *
 * if (showPrompt) {
 *   return <InstallBanner onInstall={installApp} />;
 * }
 * ```
 */
export const usePWA = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
};
