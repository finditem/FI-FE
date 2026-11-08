import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetDetailPostResponse } from "../types/PostDetailType";

interface UseGetDetailPostParams {
  id: number;
  /**
   * 서버에서 프리패치한 상세 응답으로 쿼리를 시드합니다. 세션 종료 등으로 캐시가 비워져도
   * 이 값으로 즉시 재시드되어 본문이 사라지지 않습니다.
   * @author suhyeon
   */
  initialData?: GetDetailPostResponse;
}

export const useGetDetailPost = ({ id, initialData }: UseGetDetailPostParams) => {
  // 서버 프리패치로 하이드레이트된 본문은 익명(쿠키 없음) 응답이라 isMine·favoriteStatus 같은
  // 사용자별 값이 비어 있다. 초기 페인트는 하이드레이트 데이터로 즉시 그리되, 마운트 시 한 번
  // 다시 조회해 로그인 사용자의 개인화 값으로 교정한다. initialData로 시드해 두면 인증 세션
  // 종료로 queryClient.clear()가 호출돼도 본문이 스켈레톤으로 무너지지 않고 유지된다.
  return useAppQuery<GetDetailPostResponse>("public", ["post-detail", id], `/posts/${id}`, {
    refetchOnMount: "always",
    initialData,
  });
};
