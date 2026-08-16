import { ToastType } from "@/types";

export const buildErrorMap = <T extends Record<string, ToastType>>(
  statusMap: T,
  t: (key: string) => string
): Record<keyof T, { message: string; status: ToastType }> =>
  Object.fromEntries(
    Object.entries(statusMap).map(([code, status]) => [code, { message: t(code), status }])
  ) as Record<keyof T, { message: string; status: ToastType }>;
