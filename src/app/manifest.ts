import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "찾길",
    short_name: "찾길",
    start_url: "/",
    scope: "/",
    display_override: ["window-controls-overlay", "standalone"],
    display: "standalone",
    lang: "ko-KR",
    dir: "ltr",
    background_color: "#46C691",
    theme_color: "#6ED5A7",
    orientation: "portrait",
    categories: ["social", "productivity", "navigation"],
    screenshots: [
      {
        src: "/pwa/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
      },
      {
        src: "/pwa/screenshot-desktop.png",
        sizes: "768x844",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
