import ReactDOM from "react-dom";
import { Footer, LanguageSwitcher } from "@/components";
import "../globals.css";
import AppProviders from "@/providers/AppProviders";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import Script from "next/script";
import { Metadata } from "next";
import MSWProvider from "@/providers/MSWProvider";
import AuthBootstrap from "./authBootStrap";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const pretendard = localFont({
  src: [
    {
      path: "../../../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      absolute: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    icons: {
      icon: "/favicon/default/favicon-32.png",
    },
    openGraph: {
      type: "website",
      images: [
        {
          url: "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      images: [
        "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png",
      ],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  ReactDOM.preload("/icons/sprite.svg", { as: "image", type: "image/svg+xml" });
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("refresh_token");
  const isProd = process.env.VERCEL_ENV === "production";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang={locale} className={pretendard.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="찾아줘!" />
        <link rel="apple-touch-icon" sizes="120x120" href="/pwa/apple-icon-120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa/apple-icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/pwa/apple-icon-167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pwa/apple-icon-180.png" />
        <meta name="naver-site-verification" content="6e6273a72b1c013d4f54c30896dbdb7a6ab63945" />
      </head>
      <body className="mx-auto max-w-[768px] border-x-2 flex-col-center">
        {isProd && gaId && <GoogleAnalytics gaId={gaId} />}
        {isProd && gtmId && <GoogleTagManager gtmId={gtmId} />}
        {isProd && clarityId && (
          <Script id="clarity-script" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
        <NextIntlClientProvider>
          <AppProviders>
            <MSWProvider />
            <AuthBootstrap />
            <main className="w-full flex-1">{children}</main>
            <LanguageSwitcher />
            <Footer hasToken={hasToken} />
            <Script
              src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
              integrity="sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            {isProd && (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            )}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
