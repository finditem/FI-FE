# Repository instructions

## Mock data

- 테스트, Storybook, MSW, 개발 화면에서 사용하는 mock/fixture 데이터는 테스트나 스토리 파일 안에 직접 선언하거나 라우트 `_constants`에 두지 않는다.
- 모든 mock/fixture 데이터는 `src/mock/data/`의 도메인별 `*.data.ts` 파일에 두고 `src/mock/data/index.ts`에서 export하여 재사용한다.
