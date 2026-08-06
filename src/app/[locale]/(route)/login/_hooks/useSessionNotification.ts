import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const useSessionNotification = () => {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isShown = useRef(false);
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (reason === "session-expired" && !isShown.current) {
      isShown.current = true;

      addToast("세션이 만료되었어요. 다시 로그인 해주세요.", "warning");
    }
  }, [searchParams, addToast, router]);

  return { reason };
};

export default useSessionNotification;
