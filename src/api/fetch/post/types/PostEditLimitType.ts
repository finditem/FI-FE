/** 게시글 수정 횟수 제한(PUT /posts/{postId})에 걸렸을 때 서버가 내려주는 에러 코드. */
export const POST_EDIT_RATE_LIMIT_CODE = "POST429-UPDATE_RATE_LIMITED";

/** 1분 내 허용된 최대 수정 횟수. 서버 응답에는 포함되지 않는 정책 값이라 상수로 관리한다. */
export const POST_EDIT_LIMIT_COUNT = 5;

export interface PostEditLimitErrorResult {
  /** 제한이 해제되기까지 남은 시간(초). */
  retryAfterSeconds: number;
}
