import { createRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { textareaSubmitKeyHandler } from "./textareaSubmitKeyHandler";

const buildTextareaInForm = () => {
  const form = document.createElement("form");
  const textarea = document.createElement("textarea");
  form.appendChild(textarea);
  form.requestSubmit = jest.fn();
  return { form, textarea };
};

const createKeyDownEvent = (
  textarea: HTMLTextAreaElement,
  partial: {
    key?: string;
    shiftKey?: boolean;
    isComposing?: boolean;
    preventDefault?: jest.Mock;
  } = {}
): ReactKeyboardEvent<HTMLTextAreaElement> => {
  const preventDefault = partial.preventDefault ?? jest.fn();
  return {
    key: partial.key ?? "Enter",
    shiftKey: partial.shiftKey ?? false,
    preventDefault,
    currentTarget: textarea,
    nativeEvent: {
      isComposing: partial.isComposing ?? false,
    } as ReactKeyboardEvent<HTMLTextAreaElement>["nativeEvent"],
  } as unknown as ReactKeyboardEvent<HTMLTextAreaElement>;
};

describe("textareaSubmitKeyHandler", () => {
  it("Enter(Shift 없음, IME 조합 아님)이면 preventDefault·form.requestSubmit·textarea height auto", () => {
    const { form, textarea } = buildTextareaInForm();
    textarea.style.height = "80px";
    const ref = createRef<HTMLTextAreaElement>();
    ref.current = textarea;
    const preventDefault = jest.fn();
    const e = createKeyDownEvent(textarea, { preventDefault });

    textareaSubmitKeyHandler(e, ref);

    expect(preventDefault).toHaveBeenCalled();
    expect(form.requestSubmit).toHaveBeenCalled();
    expect(textarea.style.height).toBe("auto");
  });

  it("Shift+Enter이면 preventDefault·requestSubmit·높이 변경 없음", () => {
    const { form, textarea } = buildTextareaInForm();
    textarea.style.height = "80px";
    const ref = createRef<HTMLTextAreaElement>();
    ref.current = textarea;
    const preventDefault = jest.fn();
    const e = createKeyDownEvent(textarea, { shiftKey: true, preventDefault });

    textareaSubmitKeyHandler(e, ref);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(form.requestSubmit).not.toHaveBeenCalled();
    expect(textarea.style.height).toBe("80px");
  });

  it("IME 조합 중(isComposing)이면 submit·preventDefault 모두 하지 않는다", () => {
    const { form, textarea } = buildTextareaInForm();
    const ref = createRef<HTMLTextAreaElement>();
    ref.current = textarea;
    const preventDefault = jest.fn();
    const e = createKeyDownEvent(textarea, { isComposing: true, preventDefault });

    textareaSubmitKeyHandler(e, ref);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it("Enter가 아닌 키는 submit·preventDefault 모두 하지 않는다", () => {
    const { form, textarea } = buildTextareaInForm();
    const ref = createRef<HTMLTextAreaElement>();
    ref.current = textarea;
    const preventDefault = jest.fn();
    const e = createKeyDownEvent(textarea, { key: "a", preventDefault });

    textareaSubmitKeyHandler(e, ref);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it("ref.current가 null이면 submit은 해도 ref 기준 clearHeight는 생략된다", () => {
    const { form, textarea } = buildTextareaInForm();
    textarea.style.height = "80px";
    const ref = createRef<HTMLTextAreaElement>();
    const e = createKeyDownEvent(textarea);

    textareaSubmitKeyHandler(e, ref);

    expect(form.requestSubmit).toHaveBeenCalled();
    expect(textarea.style.height).toBe("80px");
  });

  it("form이 없으면 requestSubmit 없이 ref 높이만 auto로", () => {
    const textarea = document.createElement("textarea");
    textarea.style.height = "50px";
    const ref = createRef<HTMLTextAreaElement>();
    ref.current = textarea;
    const e = createKeyDownEvent(textarea);

    textareaSubmitKeyHandler(e, ref);

    expect(textarea.style.height).toBe("auto");
  });
});
