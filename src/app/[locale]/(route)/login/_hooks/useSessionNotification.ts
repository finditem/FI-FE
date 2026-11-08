import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const useSessionNotification = () => {
  const t = useTranslations("SessionNotification");
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isShown = useRef(false);
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (reason === "session-expired" && !isShown.current) {
      isShown.current = true;

      addToast(t("sessionExpired"), "warning");
    }
  }, [searchParams, addToast, router, t]);

  return { reason };
};

export default useSessionNotification;
