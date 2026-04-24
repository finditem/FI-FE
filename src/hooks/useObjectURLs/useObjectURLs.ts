import { useEffect, useState } from "react";

/**
 * `File` 배열마다 `URL.createObjectURL`로 만든 미리보기 URL 문자열 배열을 반환합니다.
 *
 * 언마운트나 `images`가 바뀌기 직전에 이전에 만든 URL은 `URL.revokeObjectURL`로 해제합니다.
 *
 * @param images - 미리보기할 로컬 파일 목록. 빈 배열·falsy면 반환 URL도 빈 배열입니다.
 *
 * @returns `images`와 동일한 길이의 blob/object URL 문자열 배열 (빈 입력이면 `[]`)
 *
 * @remarks
 * - 이펙트 의존성은 `images` 참조입니다. `[]`·`[file]`처럼 매 렌더 새 배열 리터럴을 넘기면 참조가 매번 바뀌어 과도하게 다시 실행될 수 있으므로, `useState`/`useMemo`/모듈 상수 등 안정된 배열을 넘기세요.
 * - 내용만 바뀌고 배열 참조가 같으면 갱신되지 않을 수 있습니다.
 * - 생성된 URL은 `<img src>` 등에 바로 사용할 수 있습니다.
 *
 * @author hyungjun
 *
 * @example
 * ```tsx
 * const [files, setFiles] = useState<File[]>([]);
 * const urls = useObjectURLs(files);
 * return urls.map((url, i) => <img key={url} src={url} alt="" />);
 * ```
 */

const useObjectURLs = (images: File[]) => {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) {
      setUrls((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    const newUrls = images.map((file) => URL.createObjectURL(file));
    setUrls(newUrls);

    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  return urls;
};

export default useObjectURLs;
