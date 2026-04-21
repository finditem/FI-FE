import { clsx, type ClassValue } from "clsx";

/**
 * clsx를 기반으로 클래스명을 병합하는 유틸리티 함수입니다.
 *
 * @param inputs - 병합할 클래스 값 목록
 *
 * @returns 병합된 클래스 문자열
 *
 * @example
 * ```ts
 * cn("px-4", isActive && "bg-blue-500"); // "px-4 bg-blue-500" or "px-4"
 * ```
 */

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
