interface JsonLdProps {
  /** schema.org 구조화 데이터 객체 */
  data: Record<string, unknown>;
}

/**
 * schema.org 구조화 데이터를 `application/ld+json` 스크립트로 렌더합니다.
 *
 * @remarks
 * - 서버 컴포넌트에서 렌더해 초기 HTML에 실리도록 씁니다. 크롤러는 JS를 실행하지 않아도 읽을 수 있습니다.
 * - 사용자 입력(게시글 제목 등)이 섞이므로 `<`를 이스케이프해 스크립트 태그가 조기 종료되지 않게 합니다.
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: "찾아줘!" }} />
 * ```
 */
const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
};

export default JsonLd;
