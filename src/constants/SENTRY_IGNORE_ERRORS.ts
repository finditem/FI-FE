/**
 * Sentry로 보내지 않을 에러 메시지 패턴입니다. 서버·edge·클라이언트 init의 `ignoreErrors`가 함께 씁니다.
 *
 * @remarks
 * - 코드 결함이 아니라 정상 흐름이거나 외부 요인인 에러만 넣습니다. 여기 걸린 에러는 GitHub 이슈 자동 생성까지
 *   가지 않으므로, 실제 장애 신호일 수 있는 에러(`fetch failed`, 429 등)는 넣지 않습니다.
 * - SDK는 `"<type>: <value>"`와 `value`를 함께 검사하므로 메시지 일부만 맞으면 됩니다.
 * - 401: 비로그인 쓰기 동작과 세션 만료는 `authApi`·`authSession`이 의도적으로 401을 돌려주고 호출부가 로그인
 *   안내로 처리합니다(#1249).
 * - `MSGesture`: 구형 IE·Edge 전용 API로, 외부 SDK가 이를 찾다가 실패하는 브라우저 호환성 에러입니다(#1276).
 *
 * @author jigwon
 */
export const SENTRY_IGNORE_ERRORS = [
  /Request failed with status code 401/,
  /MSGesture is not a constructor/,
];
