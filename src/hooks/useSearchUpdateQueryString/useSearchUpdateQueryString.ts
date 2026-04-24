import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchMode = "default" | "region" | "post";

/**
 * 현재 URL의 쿼리스트링을 복사해 특정 키만 바꾼 뒤, `router.push` 또는 `router.replace`로 반영합니다.
 *
 * 목록·검색 화면에서 필터/검색 파라미터를 바꿀 때 사용합니다.
 *
 * @param routerMode - `"push"`(기본) 또는 `"replace"`. 히스토리 쌓기 여부만 다르고 둘 다 `{ scroll: false }`입니다.
 *
 * @returns
 * - `searchMode` — 쿼리 `search` 값. 없거나 허용 목록 밖이면 `"default"`입니다.
 * - `searchUpdateQuery` — `(key, value?)` 형태. `value`가 있으면 `set`, 없거나 빈 문자열 등 falsy면 `delete` 후 이동합니다.
 *
 * @remarks
 * - `search` 파라미터는 `default` | `region` | `post`만 의미 있게 쓰는 UI 관례에 맞춰 읽습니다(그 외 값도 문자열로는 전달될 수 있음).
 * - 새 URL은 `` `${pathname}?${params}` `` 형태이며, 쿼리가 비면 `?`만 붙은 문자열이 될 수 있습니다.
 *
 * @author hyungjun
 *
 * @example
 * ```tsx
 * const { searchMode, searchUpdateQuery } = useSearchUpdateQueryString("replace");
 * searchUpdateQuery("keyword", "coffee");
 * searchUpdateQuery("keyword");
 * ```
 */

const useSearchUpdateQueryString = (routerMode: "push" | "replace" = "push") => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchMode = (searchParams.get("search") as SearchMode) || "default";

  const searchUpdateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const url = `${pathname}?${params.toString()}`;

    if (routerMode === "replace") {
      router.replace(url, { scroll: false });
    } else {
      router.push(url, { scroll: false });
    }
  };

  return { searchMode, searchUpdateQuery };
};

export default useSearchUpdateQueryString;
