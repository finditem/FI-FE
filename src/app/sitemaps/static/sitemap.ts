import type { MetadataRoute } from "next";
import { buildLocalizedEntry } from "../_utils/buildLocalizedEntry/buildLocalizedEntry";

/** 고정 경로 사이트맵입니다. `/sitemap.xml` 인덱스에 포함됩니다. */
export default function sitemap(): MetadataRoute.Sitemap {
  // 정적 라우트는 실제 수정 시각을 알 수 없어 lastModified를 넣지 않는다. 매 요청 시각을 넣으면
  // 검색엔진이 lastmod 값을 신뢰하지 않게 된다.
  // /list?type= 같은 쿼리 변형은 canonical이 /list로 모이므로 넣지 않는다.
  return ["/", "/list", "/public-data", "/notice", "/hello"].map((route) =>
    buildLocalizedEntry(route, {
      changeFrequency: "daily",
      priority: route === "/" ? 1.0 : 0.8,
    })
  );
}
