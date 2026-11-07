import { after, NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SentryWebhookPayload } from "./_types/SentryWebhookType";
import { syncSentryIssue } from "./_utils/syncSentryIssue/syncSentryIssue";

const SENTRY_WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET!;

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

  // Sentry는 웹훅 응답이 늦으면 실패로 보고 다시 보낸다. Sentry API 조회와 GitHub 호출을 기다리지 않고
  // 곧바로 응답해 재시도로 인한 중복 이슈를 막는다. 실패는 응답 뒤라 Vercel 함수 로그로만 확인할 수 있다.
  // Sentry로 다시 보고하지 않는 것은 이 라우트의 실패가 새 웹훅을 부르는 순환을 피하기 위해서다.
  after(async () => {
    try {
      await syncSentryIssue(payload);
    } catch (error) {
      console.error("[sentry-webhook] GitHub 이슈 동기화 실패", payload.action, error);
    }
  });

  return NextResponse.json({ accepted: true }, { status: 202 });
};
