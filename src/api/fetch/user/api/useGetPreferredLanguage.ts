import useAppQuery from "@/api/_base/query/useAppQuery";
import { PreferredLanguageResponse } from "../types/PreferredLanguageType";

export const PREFERRED_LANGUAGE_QUERY_KEY = ["preferred-language"] as const;

export const useGetPreferredLanguage = (enabled = true) => {
  return useAppQuery<PreferredLanguageResponse>(
    "auth",
    PREFERRED_LANGUAGE_QUERY_KEY,
    "/users/me/preferred-language",
    {
      enabled,
      staleTime: Infinity,
      gcTime: Infinity,
    }
  );
};
