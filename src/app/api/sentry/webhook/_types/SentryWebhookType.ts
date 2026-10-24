/** Sentry 웹훅과 Sentry API가 내려주는 스택 프레임. 웹훅은 snake_case, API는 camelCase를 쓴다. */
export type SentryFrame = {
  filename?: string | null;
  absPath?: string | null;
  abs_path?: string | null;
  module?: string | null;
  function?: string | null;
  lineNo?: number | null;
  lineno?: number | null;
  colNo?: number | null;
  colno?: number | null;
  inApp?: boolean | null;
  in_app?: boolean | null;
};

export type SentryException = {
  type?: string | null;
  value?: string | null;
  stacktrace?: { frames?: SentryFrame[] | null } | null;
};

export type SentryRequest = {
  url?: string | null;
  method?: string | null;
};

export type SentryContexts = Record<string, { name?: string; version?: string; model?: string }>;

/** 웹훅 tags는 `[key, value]` 배열, API tags는 `{ key, value }` 객체 배열이다. */
export type SentryTags = Array<[string, string] | { key: string; value: string }>;

export type SentryIssue = {
  id?: string;
  shortId?: string;
  title?: string;
  culprit?: string | null;
  level?: string;
  status?: string;
  platform?: string;
  project?: { slug?: string; name?: string };
  metadata?: { type?: string; value?: string; filename?: string; function?: string };
  count?: string | number;
  userCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  url?: string;
  web_url?: string;
  permalink?: string;
};

/** 경보 규칙 웹훅(`event_alert`)의 `data.event` */
export type SentryWebhookEvent = {
  event_id?: string;
  issue_id?: string;
  title?: string;
  message?: string;
  level?: string;
  culprit?: string | null;
  platform?: string;
  environment?: string;
  release?: string | null;
  datetime?: string;
  url?: string;
  web_url?: string;
  issue_url?: string;
  tags?: SentryTags;
  request?: SentryRequest | null;
  contexts?: SentryContexts;
  exception?: { values?: SentryException[] | null } | null;
};

/** Sentry API `GET /issues/{issueId}/events/latest/` 응답 중 본문에 쓰는 필드 */
export type SentryApiEvent = {
  eventID?: string;
  title?: string;
  message?: string;
  platform?: string;
  dateCreated?: string;
  release?: { version?: string } | null;
  tags?: SentryTags;
  contexts?: SentryContexts;
  entries?: Array<
    | { type: "exception"; data: { values?: SentryException[] | null } }
    | { type: "request"; data: SentryRequest }
    | { type: string; data: unknown }
  >;
};

export type SentryWebhookPayload = {
  action?: string;
  installation?: {
    uuid?: string;
  };
  data?: {
    issue?: SentryIssue;
    event?: SentryWebhookEvent;
    triggered_rule?: string;
    description?: string;
    web_url?: string;
  };
};
