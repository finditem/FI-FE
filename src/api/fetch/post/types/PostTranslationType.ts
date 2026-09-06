import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

export interface PostTranslationData {
  postId: number;
  languageCode: "KO" | "EN";
  translatedTitle: string;
  translatedContent: string;
}

export interface PostTranslationResponse extends ApiBaseResponseType<PostTranslationData> {}
