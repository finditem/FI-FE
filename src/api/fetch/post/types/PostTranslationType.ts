export interface PostTranslationResponse {
  postId: number;
  languageCode: "KO" | "EN";
  translatedTitle: string;
  translatedContent: string;
}
