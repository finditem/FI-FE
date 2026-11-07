import { SentryWebhookPayload } from "../../_types/SentryWebhookType";
import { buildIssueBody } from "../buildIssueBody/buildIssueBody";
import { fetchLatestSentryEvent } from "../fetchLatestSentryEvent/fetchLatestSentryEvent";
import { findGithubIssueBySentryId } from "../findGithubIssueBySentryId/findGithubIssueBySentryId";
import { getGithubAppToken } from "../getGithubAppToken/getGithubAppToken";
import { requestGithub } from "../requestGithub/requestGithub";
import { resolveSentryAssignee } from "../resolveSentryAssignee/resolveSentryAssignee";

/** 새 이슈를 만들 수 있는 웹훅. `created`는 이슈 웹훅, `triggered`는 경보 규칙 웹훅이다. */
const CREATE_ACTIONS = new Set(["created", "triggered"]);

/** 보관 웹훅. Sentry 화면은 Archived로 표시하지만 구독 이벤트 이름은 `issue.ignored`라 두 값을 모두 받는다. */
const ARCHIVE_ACTIONS = new Set(["archived", "ignored"]);

const ensureOk = async (response: Response, step: string) => {
  if (!response.ok) {
    throw new Error(`${step} 실패 (${response.status}): ${await response.text()}`);
  }
};

const createIssue = async (token: string, payload: SentryWebhookPayload) => {
  const issue = payload.data?.issue;
  const event = payload.data?.event;
  const title =
    issue?.title ??
    event?.title ??
    event?.message ??
    payload.data?.description ??
    "Unknown Sentry Error";

  const latestEvent = await fetchLatestSentryEvent(issue?.id ?? event?.issue_id);
  const assignee = resolveSentryAssignee(issue?.culprit ?? event?.culprit);
  const body = {
    title: `[Sentry] ${title}`,
    body: buildIssueBody(payload, latestEvent),
    labels: ["bug", "sentry"],
  };

  const response = await requestGithub(token, "/issues", {
    method: "POST",
    body: assignee ? { ...body, assignees: [assignee] } : body,
  });

  // 담당자 표의 로그인이 협업자가 아니면 422가 난다. 이슈 자체는 남기도록 담당자 없이 한 번 더 만든다.
  if (response.status === 422 && assignee) {
    await ensureOk(
      await requestGithub(token, "/issues", { method: "POST", body }),
      "GitHub 이슈 생성"
    );
    return;
  }

  await ensureOk(response, "GitHub 이슈 생성");
};

const changeState = async (
  token: string,
  issueNumber: number,
  comment: string,
  update: { state: "open" | "closed"; state_reason?: "completed" | "not_planned" | "reopened" }
) => {
  await ensureOk(
    await requestGithub(token, `/issues/${issueNumber}/comments`, {
      method: "POST",
      body: { body: comment },
    }),
    "GitHub 이슈 댓글 작성"
  );
  await ensureOk(
    await requestGithub(token, `/issues/${issueNumber}`, { method: "PATCH", body: update }),
    "GitHub 이슈 상태 변경"
  );
};

/**
 * Sentry 웹훅 하나를 GitHub 이슈에 반영하는 유틸 함수입니다.
 *
 * @remarks
 * - `action`별 동작은 다음과 같습니다. 같은 Sentry 이슈의 GitHub 이슈는 `findGithubIssueBySentryId`로 찾습니다.
 *   - `created`(이슈 웹훅), `triggered`(경보 규칙 웹훅): 기존 이슈가 없을 때만 새로 만듭니다. 있으면 아무것도 하지 않아
 *     웹훅 재시도나 두 웹훅의 동시 수신으로 이슈가 중복되지 않습니다.
 *   - `unresolved`(재발 포함): 기존 이슈가 닫혀 있으면 댓글을 남기고 다시 엽니다. 기존 이슈가 없으면 만들지 않습니다.
 *   - `resolved`, `archived`(`ignored`): 기존 이슈가 열려 있으면 댓글을 남기고 닫습니다. 사유는 각각 `completed`, `not_planned`입니다.
 * - 이 함수가 바꾼 상태는 봇 계정 이름으로 기록되므로 `sentry-issue-sync.yml`이 다시 Sentry로 되돌려 보내지 않습니다.
 * - 동시에 도착한 두 웹훅이 모두 조회를 마친 뒤 생성하면 중복을 완전히 막지는 못합니다. 라우트가 곧바로 응답해
 *   Sentry 재시도를 줄이는 것으로 대부분을 막습니다.
 * - 실패하면 에러를 던집니다. 응답을 이미 보낸 뒤 `after()`에서 실행되므로 호출부가 로그로 남깁니다.
 *
 * @param payload - 서명 검증을 마친 Sentry 웹훅 요청 본문
 *
 * @author jigwon
 */

/**
 * @example
 * after(() => syncSentryIssue(payload).catch((error) => console.error(error)));
 */
export const syncSentryIssue = async (payload: SentryWebhookPayload) => {
  const action = payload.action ?? "";
  const sentryIssueId = payload.data?.issue?.id ?? payload.data?.event?.issue_id;
  const isCreateAction = CREATE_ACTIONS.has(action);

  if (
    !isCreateAction &&
    !["unresolved", "resolved"].includes(action) &&
    !ARCHIVE_ACTIONS.has(action)
  )
    return;

  const token = await getGithubAppToken();

  // ID가 없는 웹훅은 대조할 방법이 없으므로 생성만 하고 상태 변경은 건너뛴다.
  if (!sentryIssueId) {
    if (isCreateAction) await createIssue(token, payload);
    return;
  }

  const existing = await findGithubIssueBySentryId(token, sentryIssueId);

  if (isCreateAction) {
    if (!existing) await createIssue(token, payload);
    return;
  }

  if (!existing) return;

  if (action === "unresolved" && existing.state === "closed") {
    await changeState(
      token,
      existing.number,
      "Sentry에서 이 이슈가 다시 미해결 상태가 되어(재발 포함) 이슈를 다시 엽니다.",
      { state: "open", state_reason: "reopened" }
    );
    return;
  }

  if (action === "resolved" && existing.state === "open") {
    await changeState(token, existing.number, "Sentry에서 해결 처리되어 이슈를 닫습니다.", {
      state: "closed",
      state_reason: "completed",
    });
    return;
  }

  if (ARCHIVE_ACTIONS.has(action) && existing.state === "open") {
    await changeState(token, existing.number, "Sentry에서 보관(무시) 처리되어 이슈를 닫습니다.", {
      state: "closed",
      state_reason: "not_planned",
    });
  }
};
