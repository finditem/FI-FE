/**
 * Web Push 관련 상수 모음입니다.
 *
 * @remarks
 * - {@link VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC}: `pickVapidPublicKey`에서 필드명을 못 찾을 때,
 *   값 문자열이 VAPID 공개키로 보이는지 판별하는 최소 길이입니다.
 * - {@link WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS}: 로그아웃 전 서버 구독 해제 API 대기 상한입니다.
 *
 * @author hyungjun
 */

/**
 * pickVapidPublicKey: 알려진 필드명이 없을 때, 값이 VAPID 공개키(일반적으로 URL-safe Base64)로
 * 보이는지 판별하기 위한 최소 문자열 길이 휴리스틱입니다.
 */
export const VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC = 80;

/**
 * 로그아웃 API 호출 전 푸시 구독 해제(DELETE) 대기 상한(ms).
 * 초과 시 로그아웃은 진행하며, 이미 세션이 끊긴 뒤에는 구독 해제가 실패할 수 있습니다.
 */
export const WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS = 4_000;
