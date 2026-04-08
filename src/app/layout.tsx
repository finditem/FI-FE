import { Footer } from "@/components/layout";
import "./globals.css";
import Providers from "@/providers/QueryProviders";
import { ToastProvider } from "@/providers/ToastProviders";
import { SnackBarProvider } from "@/providers/SnackBarProviders";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import Script from "next/script";
import { Metadata } from "next";
import MSWProvider from "@/providers/MSWProvider";
import AuthBootstrap from "./authBootStrap";
import { NotificationSSEProvider } from "@/providers/NotificationSSEProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PWAProvider } from "@/providers/PWAProvider";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    absolute: "우리 동네 분실물 찾기, 찾아줘!",
    template: "%s | 찾아줘!",
  },
  description:
    "가장 빠르고 쉬운 분실물 센터. 경찰청 분실물부터 내 주변 분실물까지, 지도에서 바로 확인해보세요!",
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
        alt: "찾아줘!",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProd = process.env.VERCEL_ENV === "production";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="ko" className={pretendard.variable}>
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
        <Providers>
          <PWAProvider>
            <SnackBarProvider>
              <ToastProvider>
                <MSWProvider />
                <AuthBootstrap />
                <NotificationSSEProvider>
                  <main className="w-full flex-1">{children}</main>
                  <Footer />
                </NotificationSSEProvider>
              </ToastProvider>
            </SnackBarProvider>
          </PWAProvider>
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
        </Providers>
      </body>
    </html>
  );
}
