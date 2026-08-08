"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicDataTabType } from "@/app/[locale]/(route)/public-data/_types/PublicDataTabType";

export const usePublicDataDetailQuery = (atcId: string, type: PublicDataTabType = "found") => {
  return useQuery<any>({
    queryKey: ["publicDataDetail", atcId, type],
    queryFn: async () => {
      if (!atcId) throw new Error("atcId is required");

      const params = new URLSearchParams();
      params.append("atcId", atcId);

      const apiEndpoint = type === "lost" ? "/api/public/lost" : "/api/public/found";
      const response = await fetch(`${apiEndpoint}?${params.toString()}`);

      if (!response.ok) {
        throw new Error("데이터를 불러오지 못했어요");
      }

      const data = await response.json();

      return data.items?.item || null;
    },
    enabled: !!atcId,
    staleTime: 1000 * 60 * 60,
  });
};
