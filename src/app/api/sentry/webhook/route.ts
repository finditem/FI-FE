import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const SENTRY_WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET!;

const GITHUB_REPO = "finditem/FI-FE";

function verifySignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", SENTRY_WEBHOOK_SECRET);
  const digest = hmac.update(body).digest("hex");
  const digestBuf = Buffer.from(digest);
  const signatureBuf = Buffer.from(signature);
  if (digestBuf.length !== signatureBuf.length) return false;
  return crypto.timingSafeEqual(digestBuf, signatureBuf);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("sentry-hook-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const issue = payload?.data?.issue;

  if (!issue) {
    return NextResponse.json({ error: "No issue data" }, { status: 400 });
  }

  const githubIssueBody = [
    `## Sentry Issue`,
    ``,
    `**Level:** ${issue.level}`,
    `**Status:** ${issue.status}`,
    `**Culprit:** ${issue.culprit ?? "unknown"}`,
    ``,
    `[Sentry에서 보기](${issue.url})`,
  ].join("\n");

  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      title: `[Sentry] ${issue.title}`,
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
}
