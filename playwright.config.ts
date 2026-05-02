import { defineConfig, devices } from "@playwright/test";

/**
 * config.ts 세팅 공식문서: https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* 테스트 실행 파일 위치 */
  testDir: "./tests/e2e",
  /* 파일 단위로 테스트를 병렬 실행한다 */
  fullyParallel: true,
  /* CI 환경에서 test.only가 source code에 남아있을 경우 build를 실패시킨다 */
  forbidOnly: !!process.env.CI,
  /* CI 환경에서 테스트를 재시도한다 */
  retries: process.env.CI ? 2 : 0,
  /* CI 환경에서는 병렬 테스트를 사용하지 않는다 */
  workers: process.env.CI ? 1 : undefined,
  /* 테스트 결과를 html로 저장한다 */
  reporter: [["html"], ["junit", { outputFile: "test-results/junit.xml" }]],
  /* 아래에 정의된 모든 프로젝트에 공통으로 적용되는 설정 */
  use: {
    /* await page.goto('/') 기준 URL */
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",

    /* 실패한 테스트를 재시도할 때 trace를 수집한다 */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "Mobile Chrome (iPhone 12)",
      use: {
        ...devices["iPhone 12"],
        browserName: "chromium",
      },
    },

    /* 태블릿 */
    // {
    //   name: "Tablet Chrome",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     viewport: { width: 768, height: 1024 },
    //   },
    // },

    /* 데스크탑 */
    // {
    //   name: "Desktop Chrome",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //   },
    // },
  ],

  /* 테스트를 시작하기 전에 로컬 개발 서버를 실행한다 */
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_IS_E2E: "true",
    },
  },
});
