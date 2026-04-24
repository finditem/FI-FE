import { KeyboardEvent, RefObject } from "react";

const clearHeight = (textareaRef: HTMLTextAreaElement | null) => {
  if (!textareaRef) return;
  textareaRef.style.height = "auto";
};

/**
 * 채팅·댓글 `<textarea>`에서 Enter만 눌렀을 때 폼을 제출하고, Shift+Enter는 막지 않습니다.
 *
 * @remarks
 * - `Enter`이고 `!e.shiftKey`이고 IME 조합 중이 아닐 때(`nativeEvent.isComposing === false`)만 `preventDefault` 후 `currentTarget.form.requestSubmit()`을 호출합니다.
 * - 제출 직전 `textareaRef.current`의 `style.height`를 `auto`로 돌려, `textareaAutoResize`로 키운 높이를 다음 입력에 맞게 다시 잡을 수 있게 합니다.
 * - `textareaRef.current`가 없으면 높이 초기화만 생략합니다.
 *
 * @param e - `textarea`의 `onKeyDown` 이벤트
 * @param textareaRef - 같은 `textarea`에 연결한 ref(높이 초기화용)
 *
 * @author hyungjun
 */
/**
 * @example
 * ```tsx
 * <textarea ref={textareaRef} onKeyDown={(e) => textareaSubmitKeyHandler(e, textareaRef)} />
 * ```
 */

export const textareaSubmitKeyHandler = (
  e: KeyboardEvent<HTMLTextAreaElement>,
  textareaRef: RefObject<HTMLTextAreaElement | null>
) => {
  if (e.key === "Enter" && !e.shiftKey && e.nativeEvent.isComposing === false) {
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
    clearHeight(textareaRef.current ?? null);
  }
};
