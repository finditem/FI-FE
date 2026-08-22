import tsParser from "@typescript-eslint/parser";
import noKoreanLiteral from "./eslint-rules/no-korean-literal.js";

/**
 * 번역 QA에서 발견된 하드코딩 한글 텍스트를 잡기 위한 전용 설정.
 * 다른 ESLint 규칙(Next.js/React 등)은 아직 도입하지 않았으므로,
 * 이 규칙만 단독으로 실행되도록 범위를 좁혀둔다.
 */
export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/messages/**",
      "**/*.test.{ts,tsx}",
      "**/*.stories.{ts,tsx}",
      "src/mock/**",
      // 관리자 페이지는 i18n 대상이 아닌 내부 전용 한국어 UI (useTranslations 미사용, robots noindex)
      "src/app/\\[locale\\]/(admin)/**",
      "src/api/fetch/admin/**",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      i18n: {
        rules: {
          "no-korean-literal": noKoreanLiteral,
        },
      },
    },
    rules: {
      "i18n/no-korean-literal": "warn",
    },
  },
];
