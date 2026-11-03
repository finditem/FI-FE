/**
 * `new URL`의 base로 쓰는 더미 오리진입니다. 값 자체는 의미가 없고, 입력을 실제 URL 파서로 해석한
 * 뒤 오리진이 그대로 유지되는지 비교하는 기준으로만 씁니다.
 *
 * @remarks
 * `window.location.origin` 대신 고정 문자열을 쓰는 이유는 이 유틸이 SSR 등 `window`가 없는 곳에서도
 * 호출될 수 있기 때문입니다.
 */
const DUMMY_ORIGIN = "http://x";

/** URL 파서가 지워 버려 우회에 악용되는 제어 문자(탭·줄바꿈·캐리지 리턴 등)입니다. */
const CONTROL_CHAR_RE = /[\u0000-\u001f]/;

/**
 * 프로토콜 상대 URL(`//host`, `/\host`) 접두어입니다. 더미 오리진과 host가 우연히 같으면(`//x/path`)
 * 오리진 비교만으로는 통과하므로, 실제 오리진에서 외부 host로 나가는 이 형태를 먼저 거부합니다.
 */
const AUTHORITY_PREFIX_RE = /^\/[/\\]/;

/**
 * 주어진 값이 안전한 내부 콜백 URL인지 검사합니다.
 *
 * @remarks
 * 글자 패턴 대신 입력을 실제 URL 파서로 해석해 오리진이 바뀌지 않는지로 판정합니다. 라우터가 쓰는 것과
 * 같은 파서를 쓰므로, 탭(`%09`)·줄바꿈(`%0A`)·캐리지 리턴(`%0D`)을 끼워 넣어 `/\t/evil.com`처럼 외부로
 * 빠져나가는 Open Redirect 우회까지 막습니다. 제어 문자는 파서가 통과시키는 경우에도 거부하고,
 * 프로토콜 상대 URL(`//host`, `/\host`)은 host가 더미 오리진과 같아도 통과하지 못하도록 접두어로 거부합니다.
 * 반드시 `/`로 시작하는 경로여야 하며(`evil.com` 같은 상대 경로 거부), `/login`·`/sign-up` 경로는
 * 순환 리다이렉트 방지를 위해 거부합니다.
 *
 * @param url - 검사할 값
 * @returns 안전한 내부 경로이면 `true`, 아니면 `false`
 * @author suhyeon
 */
export const isValidCallbackUrl = (url: unknown): url is string => {
  if (typeof url !== "string") return false;
  if (!url.startsWith("/")) return false;
  if (AUTHORITY_PREFIX_RE.test(url)) return false;
  if (CONTROL_CHAR_RE.test(url)) return false;
  if (url.startsWith("/login") || url.startsWith("/sign-up")) return false;

  try {
    return new URL(url, DUMMY_ORIGIN).origin === DUMMY_ORIGIN;
  } catch {
    return false;
  }
};
