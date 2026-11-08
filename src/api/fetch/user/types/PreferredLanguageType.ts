import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export type PreferredLanguage = "KO" | "EN";

export interface PreferredLanguageData {
  preferredLanguage: PreferredLanguage;
}

export interface PreferredLanguageResponse extends ApiBaseResponseType<PreferredLanguageData> {}

export interface PreferredLanguageUpdateRequest {
  preferredLanguage: PreferredLanguage;
}
