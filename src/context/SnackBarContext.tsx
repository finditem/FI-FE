"use client";

import { createContext, useContext } from "react";

type SnackBarContextType = {
  /** 스낵바 메시지 표시 함수 (actionLabel, actionHandler로 액션 버튼 추가 가능) */
  showSnackBar: (message: string, actionLabel?: string, actionHandler?: () => void) => void;
};

export const SnackBarContext = createContext<SnackBarContextType | undefined>(undefined);

/**
 * 스낵바 메시지를 표시하기 위한 커스텀 훅입니다.
 *
 * @remarks
 * - `SnackBarProvider` 하위에서만 사용해야 합니다.
 *
 * @returns 스낵바 관련 함수 객체
 * - `showSnackBar`: 스낵바 메시지를 표시하는 함수
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const { showSnackBar } = useSnackBar();
 *
 * // 단순 메시지
 * showSnackBar("저장되었습니다.");
 *
 * // 액션 버튼 포함
 * showSnackBar("삭제되었습니다.", "되돌리기", handleUndo);
 * ```
 */

export const useSnackBar = () => {
  const context = useContext(SnackBarContext);

  if (!context) {
    throw new Error("useSnackBar 훅은 반드시 SnackBarProvider 안에서 사용해야 합니다.");
  }
  return context;
};
