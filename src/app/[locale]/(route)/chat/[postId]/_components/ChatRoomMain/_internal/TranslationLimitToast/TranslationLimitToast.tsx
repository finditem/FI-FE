"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { cn } from "@/utils";
import useGetChatTranslationUsage from "@/api/fetch/chatMessage/api/useGetChatTranslationUsage";
import useTranslationLimitToast from "../../../../_hooks/useTranslationLimitToast/useTranslationLimitToast";
import getTranslationResetHours from "../../../../_utils/getTranslationResetHours/getTranslationResetHours";

const TOAST_DURATION_MS = 3000;
// ToastProviders.tsx의 전역 토스트와 동일한 z-index를 사용해 겹칠 때도 항상 위에 노출되도록 맞춘다.
const TOAST_Z_INDEX = "z-[10000]";

/**
 * 번역 횟수 제한(5-1) 도달 시 화면 하단에 노출하는 토스트입니다.
 *
 * @remarks
 * - `useTranslationLimitToast` 스토어의 `isOpen`을 구독해 표시되며 3초 후 자동으로 닫힙니다.
 * - 남은 시간은 서버 사용량의 `nextAvailableAt`을 기준으로 계산하며, 없으면 로컬 자정으로 폴백합니다.
 */
const TranslationLimitToast = () => {
  const t = useTranslations("TranslationLimitToast");
  const { isOpen, nonce, close } = useTranslationLimitToast();
  const { data: usage } = useGetChatTranslationUsage();
  const [resetHours, setResetHours] = useState(0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    setResetHours(getTranslationResetHours(usage?.nextAvailableAt));
    const timer = setTimeout(close, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen, nonce, close, usage?.nextAvailableAt]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 flex w-full justify-center px-4",
        TOAST_Z_INDEX
      )}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "glass-card w-full flex-col gap-1 rounded-lg bg-toast px-4 py-[13px] flex-center",
              "items-start shadow-md"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="size-5 rounded-full bg-[#FFC642] flex-center">
                <Icon name="Warning" size={10} />
              </span>
              <p className="text-body1-semibold text-neutralInversed-normal-enteredSelected">
                {t("title")}
              </p>
            </div>
            <p className="pl-8 text-caption1-semibold text-[#d9d9d9]">
              {t("description", { hours: resetHours })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default TranslationLimitToast;
