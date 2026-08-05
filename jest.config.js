module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: { jsx: "react-jsx" } }, // JSX 변환 보장
    ],
    "^.+\\.svg$": "jest-transformer-svg", // SVG 변환 추가
    // next-intl과 그 ESM 전용 의존성들은 node_modules 내에서 CJS로 변환
    "node_modules/(next-intl|use-intl|@formatjs|@schummar|icu-minify|intl-messageformat)/.+\\.js$":
      ["babel-jest", { presets: [["@babel/preset-env", { targets: { node: "current" } }]] }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(next-intl|use-intl|@formatjs|@schummar|icu-minify|intl-messageformat)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.module\\.(css|scss|sass)$": "identity-obj-proxy",
    "\\.(css|scss|sass|less)$": "<rootDir>/src/mock/styleMock.js", // global CSS (swiper/css 등)
  },
  testPathIgnorePatterns: ["<rootDir>/tests/e2e/"],
  testMatch: ["**/?(*.)+(test|spec).(ts|tsx)"],

  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "test-results",
        outputName: "junit.xml",
        addFileAttribute: "true",
      },
    ],
  ],

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "coverage",
};
