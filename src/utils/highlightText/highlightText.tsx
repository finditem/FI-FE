/**
 * 검색어와 일치하는 텍스트 부분을 강조 표시하는 유틸리티 함수입니다.
 *
 * @remarks
 * - keyword가 없으면 원본 문자열을 그대로 반환하고, 있으면 `JSX.Element[]`를 반환합니다.
 * - 하이라이트 스타일은 `text-brand-normal-default` 클래스로 고정되어 있습니다.
 * - 대소문자를 구분하지 않고 매칭합니다.
 *
 * @param text - 원본 전체 텍스트
 * @param keyword - 강조할 검색어
 *
 * @returns keyword가 없으면 원본 문자열, 있으면 하이라이트가 적용된 JSX 배열
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * <h2>
 *   {keyword ? highlightText(post.summary, keyword) : post.summary}
 * </h2>
 * ```
 */

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text;

  const escaped = escapeRegex(keyword);
  const regex = new RegExp(`(${escaped})`, "gi");

  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-brand-normal-default">
        {part}
      </span>
    ) : (
      part
    )
  );
};
