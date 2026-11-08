import tsParser from "@typescript-eslint/parser";
import noKoreanLiteral from "./eslint-rules/no-korean-literal.js";

/**
 * 번역 QA에서 발견된 하드코딩 한글 텍스트와 로케일이 빠지는 내부 링크를 잡기 위한 전용 설정.
 * 다른 ESLint 규칙(Next.js/React 등)은 아직 도입하지 않았으므로,
 * 이 두 규칙만 실행되도록 범위를 좁혀둔다.
 */
export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/messages/**",
      "**/*.test.{ts,tsx}",
      "**/*.stories.{ts,tsx}",
      "src/mock/**",
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
      // next/link는 로케일 접두사를 붙이지 않아 영어 화면에서 한국어 경로로 이동한다.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message:
                "로케일 접두사가 붙지 않습니다. @/i18n/navigation의 Link를 사용하세요.",
            },
          ],
        },
      ],
    },
  },
];
