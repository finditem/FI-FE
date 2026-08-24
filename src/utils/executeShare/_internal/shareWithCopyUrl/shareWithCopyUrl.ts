import { ToastType } from "@/types/ToastTypes";

interface ShareWithCopyUrlMessages {
  success: string;
  error: string;
}

const DEFAULT_MESSAGES: ShareWithCopyUrlMessages = {
  success: "링크를 클립보드에 복사했어요",
  error: "클립보드 복사에 실패했어요",
};

export const shareWithCopyUrl = async (
  url: string,
  addToast: (message: string, type: ToastType) => void,
  messages: ShareWithCopyUrlMessages = DEFAULT_MESSAGES
) => {
  try {
    await navigator.clipboard.writeText(url);
    addToast(messages.success, "success");
  } catch {
    addToast(messages.error, "error");
  }
};
