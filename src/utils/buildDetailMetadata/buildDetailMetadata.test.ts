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

const baseParams = {
  locale: "ko",
  path: "/list/1",
  title: "지갑 분실",
  description: "명동에서 지갑을 잃어버렸어요",
  imageUrl: "https://example.com/wallet.png",
};

describe("buildDetailMetadata", () => {
  it("루트 레이아웃에서 덮어써져 사라지는 공유 카드 기본값을 다시 채운다", async () => {
    const metadata = await buildDetailMetadata(baseParams);

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        type: "article",
        siteName: "찾길",
        locale: "ko_KR",
        title: "지갑 분실",
        description: "명동에서 지갑을 잃어버렸어요",
      })
    );
    expect(metadata.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        title: "지갑 분실",
        description: "명동에서 지갑을 잃어버렸어요",
        images: ["https://example.com/wallet.png"],
      })
    );
  });

  it("기본 로케일은 접두사 없는 canonical과 og:url을 만든다", async () => {
    const metadata = await buildDetailMetadata(baseParams);

    expect(metadata.alternates).toEqual({ canonical: "/list/1" });
    expect(metadata.openGraph).toEqual(expect.objectContaining({ url: "/list/1" }));
  });

  it("영어 로케일은 /en 접두사가 붙은 canonical과 en_US 로케일을 만든다", async () => {
    const metadata = await buildDetailMetadata({ ...baseParams, locale: "en" });

    expect(metadata.alternates).toEqual({ canonical: "/en/list/1" });
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({ url: "/en/list/1", locale: "en_US", siteName: "finditem!" })
    );
  });

  it("이미지 대체 텍스트를 넘기지 않으면 제목을 쓴다", async () => {
    const metadata = await buildDetailMetadata(baseParams);

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        images: [{ url: "https://example.com/wallet.png", alt: "지갑 분실" }],
      })
    );
  });

  it("이미지 대체 텍스트를 넘기면 그 값을 쓴다", async () => {
    const metadata = await buildDetailMetadata({ ...baseParams, imageAlt: "검정색 지갑 사진" });

    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        images: [{ url: "https://example.com/wallet.png", alt: "검정색 지갑 사진" }],
      })
    );
  });
});
