import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetDetailPostResponse } from "../types/PostDetailType";

export const useGetDetailPost = ({ id }: { id: number }) => {
  // 서버 프리패치로 하이드레이트된 본문은 익명(쿠키 없음) 응답이라 isMine·favoriteStatus 같은
  // 사용자별 값이 비어 있다. 초기 페인트는 하이드레이트 데이터로 즉시 그리되, 마운트 시 한 번
  // 다시 조회해 로그인 사용자의 개인화 값으로 교정한다.
  return useAppQuery<GetDetailPostResponse>("public", ["post-detail", id], `/posts/${id}`, {
    refetchOnMount: "always",
  });
};
