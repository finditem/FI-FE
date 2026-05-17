/**
 * release 환경의 `window.location.hostname`과 비교할 때 쓰는 호스트명 상수입니다.
 *
 * @author hyungjun
 */

/** SSE·채팅 소켓 등에서 로컬과 유사하게 same-origin 프록시를 쓰거나, 개발용 토큰 전달 분기 등에 `window.location.hostname`과 직접 비교합니다. */
export const RELEASE_HOSTNAME = "finditem-release.vercel.app";
