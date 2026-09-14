import { useQueryClient } from "@tanstack/react-query";
import useAppMutation from "@/api/_base/query/useAppMutation";
import {
  PreferredLanguageResponse,
  PreferredLanguageUpdateRequest,
} from "../types/PreferredLanguageType";
import { PREFERRED_LANGUAGE_QUERY_KEY } from "./useGetPreferredLanguage";

export const usePatchPreferredLanguage = () => {
  const queryClient = useQueryClient();

  return useAppMutation<PreferredLanguageUpdateRequest, PreferredLanguageResponse>(
    "auth",
    "/users/me/preferred-language",
    "patch",
    {
      onSuccess: (response) => {
        queryClient.setQueryData(PREFERRED_LANGUAGE_QUERY_KEY, response);
      },
    }
  );
};
