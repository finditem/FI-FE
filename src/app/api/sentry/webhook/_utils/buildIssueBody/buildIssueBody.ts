import { SENTRY_ORG_SLUG } from "../../_constants/SENTRY_ORG_SLUG";
import {
  SentryApiEvent,
  SentryContexts,
  SentryException,
  SentryFrame,
  SentryRequest,
  SentryTags,
  SentryWebhookPayload,
} from "../../_types/SentryWebhookType";

const MAX_FRAMES = 10;

/** 공개 저장소에 올라가므로 사용자 식별 정보(user, ip 등)가 담긴 태그는 넣지 않는다. */
const ALLOWED_TAG_KEYS = [
  "environment",
  "release",
  "transaction",
  "url",
  "handled",
  "mechanism",
  "browser",
  "browser.name",
  "os",
  "os.name",
  "device",
  "device.family",
  "runtime",
  "runtime.name",
];

type NormalizedEvent = {
  eventId?: string;
  platform?: string;
  environment?: string;
  release?: string;
  datetime?: string;
  exceptions: SentryException[];
  request?: SentryRequest | null;
  contexts?: SentryContexts;
  tags: Record<string, string>;
};

const toTagRecord = (tags?: SentryTags) =>
  Object.fromEntries(
    (tags ?? []).map((tag) => (Array.isArray(tag) ? tag : [tag.key, tag.value]))
  ) as Record<string, string>;

const normalizeApiEvent = (event: SentryApiEvent): NormalizedEvent => {
  const tags = toTagRecord(event.tags);
  const findEntry = (type: string) => event.entries?.find((entry) => entry.type === type)?.data;
  const exceptionData = findEntry("exception") as { values?: SentryException[] | null } | undefined;

  return {
    eventId: event.eventID,
    platform: event.platform,
    environment: tags.environment,
    release: event.release?.version ?? tags.release,
    datetime: event.dateCreated,
    exceptions: exceptionData?.values ?? [],
    request: findEntry("request") as SentryRequest | undefined,
    contexts: event.contexts,
    tags,
  };
};

const normalizeWebhookEvent = (
  event: NonNullable<NonNullable<SentryWebhookPayload["data"]>["event"]>
): NormalizedEvent => {
  const tags = toTagRecord(event.tags);

  return {
    eventId: event.event_id,
    platform: event.platform,
    environment: event.environment ?? tags.environment,
    release: event.release ?? tags.release,
    datetime: event.datetime,
    exceptions: event.exception?.values ?? [],
    request: event.request,
    contexts: event.contexts,
    tags,
  };
};

/** 쿼리스트링에 토큰 같은 값이 섞일 수 있어 경로까지만 남긴다. */
const stripQuery = (url: string) => url.split(/[?#]/)[0];

/** 마크다운 표 셀이 깨지지 않도록 파이프와 줄바꿈을 치환한다. */
const escapeCell = (value: string) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

const formatKst = (iso?: string) => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })} (KST)`;
};

const formatFrame = (frame: SentryFrame) => {
  const file = frame.filename ?? frame.absPath ?? frame.abs_path ?? frame.module ?? "?";
  const line = frame.lineNo ?? frame.lineno;
  const col = frame.colNo ?? frame.colno;
  const location = [file, line, col]
    .filter((part) => part !== null && part !== undefined)
    .join(":");
  return `at ${frame.function ?? "<anonymous>"} (${location})`;
};

const buildStackTrace = (exception?: SentryException) => {
  const frames = exception?.stacktrace?.frames ?? [];
  if (frames.length === 0) return null;

  const inAppFrames = frames.filter((frame) => frame.inApp ?? frame.in_app);
  const targetFrames = (inAppFrames.length > 0 ? inAppFrames : frames).slice().reverse();
  const shownFrames = targetFrames.slice(0, MAX_FRAMES);
  const scope = inAppFrames.length > 0 ? "앱 코드 프레임만" : "전체 프레임";
  const omitted = targetFrames.length - shownFrames.length;

  return [
    `## 스택 트레이스`,
    ``,
    `최근 호출이 위에 오도록 정렬했고 ${scope} 최대 ${MAX_FRAMES}개를 보여줍니다.`,
    ``,
    "```",
    ...shownFrames.map(formatFrame),
    ...(omitted > 0 ? [`... ${omitted}개 프레임 생략`] : []),
    "```",
  ];
};

const formatContext = (context?: { name?: string; version?: string; model?: string }) =>
  context ? [context.name ?? context.model, context.version].filter(Boolean).join(" ") : "";

const buildTable = (rows: Array<[string, string | number | null | undefined]>) => {
  const filled = rows.filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (filled.length === 0) return [];
  return [
    `| 항목 | 값 |`,
    `| --- | --- |`,
    ...filled.map(([label, value]) => `| ${label} | ${escapeCell(String(value))} |`),
  ];
};

/**
 * Sentry 웹훅 페이로드로 GitHub 이슈 본문(마크다운)을 만드는 유틸 함수입니다.
 *
 * @remarks
 * - 요약, 에러 메시지, 스택 트레이스, 요청, 실행 환경, 태그, Sentry 링크 순으로 구성합니다. 값이 없는 절은 생략합니다.
 * - 이벤트 정보는 `latestEvent`(Sentry API 조회 결과)를 먼저 쓰고, 없으면 경보 규칙 웹훅의 `data.event`를 씁니다.
 *   이슈 생성 웹훅만 받고 API 조회도 실패하면 요약과 에러 메시지까지만 채워집니다.
 * - FI-FE는 공개 저장소이므로 사용자 정보와 IP는 넣지 않고, URL은 쿼리스트링을 잘라 경로까지만 남깁니다.
 * - Sentry 링크는 API 주소(`issue.url`)가 아니라 웹 주소를 씁니다. 웹 주소가 없으면 이슈 ID로 만듭니다.
 *
 * @param payload - Sentry 웹훅 요청 본문
 * @param latestEvent - `fetchLatestSentryEvent`로 받은 최신 이벤트 (선택 사항)
 *
 * @returns GitHub 이슈 본문 마크다운
 *
 * @author jigwon
 */

/**
 * @example
 * const latestEvent = await fetchLatestSentryEvent(payload.data?.issue?.id);
 * const body = buildIssueBody(payload, latestEvent);
 */
export const buildIssueBody = (
  payload: SentryWebhookPayload,
  latestEvent?: SentryApiEvent | null
) => {
  const issue = payload.data?.issue;
  const webhookEvent = payload.data?.event;
  const event = latestEvent
    ? normalizeApiEvent(latestEvent)
    : webhookEvent
      ? normalizeWebhookEvent(webhookEvent)
      : null;

  const issueId = issue?.id ?? webhookEvent?.issue_id;
  const sentryUrl =
    issue?.web_url ??
    issue?.permalink ??
    webhookEvent?.web_url ??
    payload.data?.web_url ??
    (issueId ? `https://${SENTRY_ORG_SLUG}.sentry.io/issues/${issueId}/` : undefined);

  const mainException = event?.exceptions.at(-1);
  const errorType = mainException?.type ?? issue?.metadata?.type;
  const errorValue =
    mainException?.value ?? issue?.metadata?.value ?? webhookEvent?.message ?? undefined;

  const summary = buildTable([
    ["레벨", issue?.level ?? webhookEvent?.level],
    ["상태", issue?.status],
    ["발생 위치", issue?.culprit ?? webhookEvent?.culprit],
    ["프로젝트", issue?.project?.name ?? issue?.project?.slug],
    ["플랫폼", issue?.platform ?? event?.platform],
    ["환경", event?.environment],
    ["릴리스", event?.release],
    ["발생 횟수", issue?.count],
    ["영향받은 사용자 수", issue?.userCount],
    ["최초 발생", formatKst(issue?.firstSeen)],
    ["최근 발생", formatKst(issue?.lastSeen ?? event?.datetime)],
  ]);

  const requestUrl = event?.request?.url ? stripQuery(event.request.url) : undefined;
  const request = buildTable([
    ["메서드", event?.request?.method],
    ["URL", requestUrl],
  ]);

  const environment = buildTable([
    ["브라우저", formatContext(event?.contexts?.browser)],
    ["OS", formatContext(event?.contexts?.os)],
    ["기기", formatContext(event?.contexts?.device)],
    ["런타임", formatContext(event?.contexts?.runtime)],
  ]);

  const eventTags = event?.tags ?? {};
  const tags = buildTable(
    ALLOWED_TAG_KEYS.filter((key) => eventTags[key]).map((key) => [
      key,
      key === "url" ? stripQuery(eventTags[key]) : eventTags[key],
    ])
  );

  const sections: string[][] = [
    [`## 요약`, ``, ...summary],
    errorType || errorValue
      ? [`## 에러`, ``, `**${errorType ?? "Error"}**: ${errorValue ?? "(메시지 없음)"}`]
      : [],
    buildStackTrace(mainException) ?? [],
    request.length > 0 ? [`## 요청`, ``, ...request] : [],
    environment.length > 0 ? [`## 실행 환경`, ``, ...environment] : [],
    tags.length > 0 ? [`<details>`, `<summary>태그</summary>`, ``, ...tags, ``, `</details>`] : [],
    [
      `## Sentry`,
      ``,
      sentryUrl
        ? `- 이슈: [${issue?.shortId ?? "Sentry에서 보기"}](${sentryUrl})`
        : `- 이슈: Sentry URL을 찾을 수 없습니다.`,
      `- 이벤트 ID: ${event?.eventId ?? "unknown"}`,
      `- 웹훅: ${payload.action ?? "unknown"}${payload.data?.triggered_rule ? ` (규칙: ${payload.data.triggered_rule})` : ""}`,
      ...(event
        ? []
        : [`- 이벤트 상세(스택 트레이스, 요청, 실행 환경)를 Sentry API에서 받아오지 못했습니다.`]),
    ],
  ];

  return sections
    .filter((section) => section.length > 0)
    .map((section) => section.join("\n"))
    .join("\n\n");
};
