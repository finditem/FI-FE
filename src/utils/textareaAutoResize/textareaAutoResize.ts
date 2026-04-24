/** `textarea` 자동 리사이즈 시 높이 상한(px) */
export const MAX_TEXTAREA_HEIGHT_PX = 120;

/**
 * `textarea`의 `scrollHeight`에 맞춰 높이를 늘렸다 줄였다 하되, `MAX_TEXTAREA_HEIGHT_PX`를 넘지 않게 맞춥니다.
 *
 * @remarks
 * - 먼저 `height: auto`로 풀어 콘텐츠에 맞게 `scrollHeight`가 갱신되게 한 뒤, `min(scrollHeight, MAX_TEXTAREA_HEIGHT_PX)`로 고정합니다.
 * - `overflowY`는 `hidden`으로 맞춥니다(캡에 걸렸을 때 내부 스크롤이 보이지 않게).
 * - `textarea.style`을 직접 바꾸고 반환은 없습니다.
 *
 * @param textarea - 조정할 `<textarea>` 요소(보통 `onInput`·`onChange`에서 `e.target`으로 넘깁니다)
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * textareaAutoResize(e.target);
 * ```
 */

export const textareaAutoResize = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = "auto";
  const newHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT_PX);
  textarea.style.height = `${newHeight}px`;
  textarea.style.overflowY = "hidden";
};
