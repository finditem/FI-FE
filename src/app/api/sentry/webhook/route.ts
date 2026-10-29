import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SentryWebhookPayload } from "./_types/SentryWebhookType";
import { buildIssueBody } from "./_utils/buildIssueBody/buildIssueBody";
import { fetchLatestSentryEvent } from "./_utils/fetchLatestSentryEvent/fetchLatestSentryEvent";
import { getGithubAppToken } from "./_utils/getGithubAppToken/getGithubAppToken";

const SENTRY_WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET!;

const GITHUB_REPO = "finditem/FI-FE";

const verifySignature = (body: string, signature: string): boolean => {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", SENTRY_WEBHOOK_SECRET);
  const digest = hmac.update(body).digest("hex");

  const digestBuf = Buffer.from(digest);
  const signatureBuf = Buffer.from(signature);

  if (digestBuf.length !== signatureBuf.length) return false;

  return crypto.timingSafeEqual(digestBuf, signatureBuf);
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

  const issue = payload.data?.issue;
  const event = payload.data?.event;
  const title =
    issue?.title ??
    event?.title ??
    event?.message ??
    payload.data?.description ??
    "Unknown Sentry Error";

  const latestEvent = await fetchLatestSentryEvent(issue?.id ?? event?.issue_id);
  const githubIssueBody = buildIssueBody(payload, latestEvent);

  let githubToken: string;

  try {
    githubToken = await getGithubAppToken();
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title: `[Sentry] ${title}`,
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
