"use client";

import { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SnackBarContext } from "@/context/SnackBarContext";
import SnackBar from "@/components/common/SnackBar/SnackBar";

/**
 * 스낵바 메시지를 전역에서 표시하기 위한 Context Provider 컴포넌트입니다.
 *
 * @remarks
 * - `SnackBarContext`를 통해 `showSnackBar` 함수를 하위 컴포넌트에 제공합니다.
 * - 스낵바는 3초 후 자동으로 사라지며, 새 메시지가 오면 타이머가 초기화됩니다.
 * - `document.body`에 portal로 렌더링됩니다.
 *
 * @author jikwon
 */

export const SnackBarProvider = ({ children }: { children: ReactNode }) => {
  const [snackBar, setSnackBar] = useState<{
    id: number;
    message: string;
    actionLabel?: string;
    actionHandler?: () => void;
  } | null>(null);

  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  const showSnackBar = useCallback(
    (message: string, actionLabel?: string, actionHandler?: () => void) => {
      const id = (idRef.current += 1);
      setSnackBar({ id, message, actionLabel, actionHandler });

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSnackBar(null);
      }, 3000);
    },
    []
  );

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed z-[9999]">
            <AnimatePresence>
              {snackBar && (
                <motion.div
                  key={snackBar.id}
                  className="pointer-events-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SnackBar
                    message={snackBar.message}
                    actionLabel={snackBar.actionLabel}
                    actionHandler={() => {
                      if (snackBar.actionHandler) snackBar.actionHandler();
                      setSnackBar(null);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </SnackBarContext.Provider>
  );
};
