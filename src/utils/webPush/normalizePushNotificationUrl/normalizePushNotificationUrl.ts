/**
 * 웹 푸시·서비스워커와 동일한 URL 규칙 (`public/normalizePushNotificationUrl.js`).
 * 게시글·문의 등은 {@link alertRouteUrl} 과 동일하고, CHAT은 채팅 리스트(`/chat`)로 이동합니다.
 */

export type PushReferenceType =
  | "POST"
  | "COMMENT"
  | "CHAT"
  | "INQUIRY"
  | "NOTICE"
  | "REPORT"
  | string;

export const buildRoutePathFromReference = (
  referenceType: PushReferenceType | undefined | null,
  referenceId: number | string | undefined | null,
  _roomId?: number | string | null
): string | null => {
  if (!referenceType) return null;
  if (referenceType !== "CHAT" && (referenceId == null || referenceId === "")) return null;

  const id = String(referenceId);

  switch (referenceType) {
    case "CHAT":
      return "/chat";
    case "POST":
    case "COMMENT":
      return `/list/${id}`;
    case "INQUIRY":
      return `/mypage/inquiries/${id}`;
    case "NOTICE":
      return `/notice/${id}`;
    case "REPORT":
      return `/mypage/reports/${id}`;
    default:
      return null;
  }
};

export const normalizePushNotificationPath = (raw: string | undefined | null): string => {
  if (!raw || typeof raw !== "string") return "/";

  let pathWithQuery = raw.trim();
  if (!pathWithQuery) return "/";

  if (pathWithQuery.startsWith("http://") || pathWithQuery.startsWith("https://")) {
    try {
      const parsed = new URL(pathWithQuery);
      pathWithQuery = parsed.pathname + parsed.search;
    } catch {
      return "/";
    }
  } else if (!pathWithQuery.startsWith("/")) {
    pathWithQuery = `/${pathWithQuery}`;
  }

  const queryIndex = pathWithQuery.indexOf("?");
  let pathname = queryIndex >= 0 ? pathWithQuery.slice(0, queryIndex) : pathWithQuery;
  let search = queryIndex >= 0 ? pathWithQuery.slice(queryIndex) : "";

  const legacyPathMatchers: [RegExp, string][] = [
    [/^\/posts\/(\d+)\/chats\/?$/i, "/chat"],
    [/^\/api\/posts\/(\d+)\/chats\/?$/i, "/chat"],
    [/^\/posts\/(\d+)\/?$/i, "/list/$1"],
    [/^\/api\/posts\/(\d+)\/?$/i, "/list/$1"],
    [/^\/inquiries\/(\d+)\/?$/i, "/mypage/inquiries/$1"],
    [/^\/api\/inquiries\/(\d+)\/?$/i, "/mypage/inquiries/$1"],
    [/^\/notices\/(\d+)\/?$/i, "/notice/$1"],
    [/^\/api\/notices\/(\d+)\/?$/i, "/notice/$1"],
    [/^\/reports\/(\d+)\/?$/i, "/mypage/reports/$1"],
    [/^\/api\/reports\/(\d+)\/?$/i, "/mypage/reports/$1"],
  ];

  for (const [pattern, replacement] of legacyPathMatchers) {
    const match = pathname.match(pattern);
    if (match) {
      pathname = replacement.includes("$1") ? replacement.replace("$1", match[1]) : replacement;
      break;
    }
  }

  if (pathname === "/chat" || /^\/chat\/\d+\/?$/i.test(pathname)) {
    pathname = "/chat";
    search = "";
  }

  return pathname + search;
};

export type PushNotificationPayload = {
  url?: string;
  link?: string;
  click_action?: string;
  referenceType?: PushReferenceType;
  referenceId?: number | string;
  roomId?: number | string;
  data?: {
    url?: string;
    link?: string;
    referenceType?: PushReferenceType;
    referenceId?: number | string;
    roomId?: number | string;
  };
};

export const resolvePushNotificationPathFromPayload = (
  payload: PushNotificationPayload | null | undefined
): string => {
  if (!payload || typeof payload !== "object") return "/";

  const data = payload.data;

  const referenceType = payload.referenceType ?? data?.referenceType;
  const referenceId = payload.referenceId ?? data?.referenceId;
  const roomId = payload.roomId ?? data?.roomId;

  const fromReference = buildRoutePathFromReference(referenceType, referenceId, roomId);
  if (fromReference) return fromReference;

  const rawUrl = payload.url ?? payload.link ?? payload.click_action ?? data?.url ?? data?.link;

  return normalizePushNotificationPath(typeof rawUrl === "string" ? rawUrl : "/");
};

export const resolvePushNotificationOpenUrl = (rawPath: string, origin: string): string => {
  const path = normalizePushNotificationPath(rawPath);
  return origin + path;
};
