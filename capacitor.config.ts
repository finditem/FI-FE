import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "kr.finditem.app",
  appName: "찾아줘!",
  webDir: "public",
  server: {
    url: "http://localhost:3000",
    cleartext: true,
    allowNavigation: ["kauth.kakao.com", "accounts.kakao.com"],
  },
};

export default config;
