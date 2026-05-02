import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const SENTRY_WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET!;

const GITHUB_REPO = "finditem/FI-FE";

type SentryIssue = {
  title?: string;
  level?: string;
  status?: string;
  culprit?: string | null;
  url?: string;
  web_url?: string;
};

type SentryEvent = {
  title?: string;
  message?: string;
  level?: string;
  culprit?: string | null;
  url?: string;
  web_url?: string;
  event_id?: string;
};

type SentryWebhookPayload = {
  action?: string;
  installation?: {
    uuid?: string;
  };
  data?: {
    issue?: SentryIssue;
    event?: SentryEvent;
    description?: string;
    web_url?: string;
  };
};

const verifySignature = (body: string, signature: string): boolean => {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", SENTRY_WEBHOOK_SECRET);
  const digest = hmac.update(body).digest("hex");

  const digestBuf = Buffer.from(digest);
  const signatureBuf = Buffer.from(signature);

  if (digestBuf.length !== signatureBuf.length) return false;

  return crypto.timingSafeEqual(digestBuf, signatureBuf);
};

const getSentryData = (payload: SentryWebhookPayload) => {
  const issue = payload.data?.issue;
  const event = payload.data?.event;

  const title =
    issue?.title ??
    event?.title ??
    event?.message ??
    payload.data?.description ??
    "Unknown Sentry Error";

  const level = issue?.level ?? event?.level ?? "unknown";
  const status = issue?.status ?? "unknown";
  const culprit = issue?.culprit ?? event?.culprit ?? "unknown";

  const sentryUrl =
    issue?.url ?? issue?.web_url ?? event?.web_url ?? event?.url ?? payload.data?.web_url ?? "";

  return {
    title,
    level,
    status,
    culprit,
    sentryUrl,
    eventId: event?.event_id ?? "unknown",
    action: payload.action ?? "unknown",
  };
};

export const POST = async (request: NextRequest) => {
  const rawBody = await request.text();
  const signature = request.headers.get("sentry-hook-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: SentryWebhookPayload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const sentryData = getSentryData(payload);

  const githubIssueBody = [
    `## Sentry Issue`,
    ``,
    `**Action:** ${sentryData.action}`,
    `**Level:** ${sentryData.level}`,
    `**Status:** ${sentryData.status}`,
    `**Culprit:** ${sentryData.culprit}`,
    `**Event ID:** ${sentryData.eventId}`,
    ``,
    sentryData.sentryUrl
      ? `[Sentry에서 보기](${sentryData.sentryUrl})`
      : `Sentry URL을 찾을 수 없습니다.`,
  ].join("\n");

  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title: `[Sentry] ${sentryData.title}`,
      body: githubIssueBody,
      labels: ["bug", "sentry"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    return NextResponse.json({ error }, { status: response.status });
  }

  const githubIssue = await response.json();

  return NextResponse.json({ url: githubIssue.html_url }, { status: 201 });
};
