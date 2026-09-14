import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { PreferredLanguage } from "@/api/fetch/user";

export interface PostTranslationData {
  postId: number;
  languageCode: PreferredLanguage;
  translatedTitle: string;
  translatedContent: string;
}

export interface PostTranslationResponse extends ApiBaseResponseType<PostTranslationData> {}
