import { MOCK_DETAIL_METADATA_PARAMS } from "@/mock/data/share.data";
import { buildDetailMetadata } from "./buildDetailMetadata";

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(
    async ({ locale }: { locale: string }) =>
      (key: string) =>
        key === "siteName" ? (locale === "en" ? "finditem!" : "찾길") : key
  ),
}));

// 기본 로케일(ko)은 접두사 없이, 그 외 로케일은 접두사를 붙이는 next-intl 라우팅 규칙을 흉내 낸다.
jest.mock("@/i18n/navigation", () => ({
  getPathname: ({ locale, href }: { locale: string; href: string }) =>
    locale === "ko" ? href : `/${locale}${href}`,
}));

const { path, title, description, imageUrl } = MOCK_DETAIL_METADATA_PARAMS;

describe("buildDetailMetadata", () => {
  it("루트 레이아웃에서 덮어써져 사라지는 공유 카드 기본값을 다시 채운다", async () => {
    const metadata = await buildDetailMetadata(MOCK_DETAIL_METADATA_PARAMS);

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        type: "article",
        siteName: "찾길",
        locale: "ko_KR",
        title,
        description,
      })
    );
    expect(metadata.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      })
    );
  });

  it("기본 로케일은 접두사 없는 canonical과 og:url을 만든다", async () => {
    const metadata = await buildDetailMetadata(MOCK_DETAIL_METADATA_PARAMS);

    expect(metadata.alternates).toEqual({ canonical: path });
    expect(metadata.openGraph).toEqual(expect.objectContaining({ url: path }));
  });

  it("영어 로케일은 /en 접두사가 붙은 canonical과 en_US 로케일을 만든다", async () => {
    const metadata = await buildDetailMetadata({ ...MOCK_DETAIL_METADATA_PARAMS, locale: "en" });

    expect(metadata.alternates).toEqual({ canonical: `/en${path}` });
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({ url: `/en${path}`, locale: "en_US", siteName: "finditem!" })
    );
  });

  it("이미지 대체 텍스트를 넘기지 않으면 제목을 쓴다", async () => {
    const metadata = await buildDetailMetadata(MOCK_DETAIL_METADATA_PARAMS);

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        images: [{ url: imageUrl, alt: title }],
      })
    );
  });

  it("이미지 대체 텍스트를 넘기면 그 값을 쓴다", async () => {
    const metadata = await buildDetailMetadata({
      ...MOCK_DETAIL_METADATA_PARAMS,
      imageAlt: "검정색 지갑 사진",
    });

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        images: [{ url: imageUrl, alt: "검정색 지갑 사진" }],
      })
    );
  });
});
