import { render } from "@testing-library/react";
import { highlightText } from "./highlightText";

describe("highlightText", () => {
  describe("keyword가 없는 경우", () => {
    it("빈 문자열이면 원본 텍스트를 그대로 반환한다", () => {
      expect(highlightText("hello world", "")).toBe("hello world");
    });
  });

  describe("keyword가 있는 경우", () => {
    it("일치하는 부분을 span으로 감싼다", () => {
      const { container } = render(<>{highlightText("hello world", "hello")}</>);
      const spans = container.querySelectorAll("span.text-brand-normal-default");

      expect(spans).toHaveLength(1);
      expect(spans[0].textContent).toBe("hello");
    });

    it("대소문자를 구분하지 않고 매칭한다", () => {
      const { container } = render(<>{highlightText("Hello World", "hello")}</>);
      const spans = container.querySelectorAll("span.text-brand-normal-default");

      expect(spans).toHaveLength(1);
      expect(spans[0].textContent).toBe("Hello");
    });

    it("여러 번 매칭되는 경우 모두 강조한다", () => {
      const { container } = render(<>{highlightText("abc abc abc", "abc")}</>);
      const spans = container.querySelectorAll("span.text-brand-normal-default");

      expect(spans).toHaveLength(3);
    });

    it("텍스트에 keyword가 없으면 span이 없다", () => {
      const { container } = render(<>{highlightText("hello world", "xyz")}</>);
      const spans = container.querySelectorAll("span.text-brand-normal-default");

      expect(spans).toHaveLength(0);
    });

    it("특수문자가 포함된 keyword를 정상 처리한다", () => {
      const { container } = render(<>{highlightText("price: $100", "$100")}</>);
      const spans = container.querySelectorAll("span.text-brand-normal-default");

      expect(spans).toHaveLength(1);
      expect(spans[0].textContent).toBe("$100");
    });
  });
});
