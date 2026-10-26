import { useMutation } from "@tanstack/react-query";
import { refreshSession } from "@/api/_base/auth/authSession";

export const useApiRefreshToken = () => {
  return useMutation({ mutationFn: refreshSession, retry: false });
};
