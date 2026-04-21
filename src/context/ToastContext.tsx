"use client";

import { createContext, useContext } from "react";
import { ToastType } from "@/types/ToastTypes";

type ToastContextType = {
  /** 토스트 메시지 추가 함수 */
  addToast: (message: string, type: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * 토스트 메시지를 추가하기 위한 커스텀 훅입니다.
 *
 * @remarks
 * - `ToastProvider` 하위에서만 사용해야 합니다.
 *
 * @returns 토스트 관련 함수 객체
 * - `addToast`: 토스트 메시지를 추가하는 함수
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const { addToast } = useToast();
 *
 * addToast("저장되었습니다.", "success");
 * addToast("오류가 발생했습니다.", "error");
 * ```
 */

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast 훅은 반드시 ToastProvider 안에서 사용해야 합니다.");
  }
  return context;
};
