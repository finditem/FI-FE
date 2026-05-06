import type { GetByIdInquiryResponseType } from "@/api/fetch/inquiry/types/GetByIdInquiryResponseType";
import type { GetInquiriesResponseType } from "@/api/fetch/inquiry/types/GetInquiriesResponseType";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

/** E2E: 문의 등록 성공 시 반환되는 id와 상세 조회 id를 맞추기 위한 값 */
export const E2E_INQUIRY_ID = 901;

export const MOCK_POST_INQUIRY_SUCCESS: ApiBaseResponseType<number> = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공",
  result: E2E_INQUIRY_ID,
};

export const MOCK_INQUIRIES_ME_EMPTY: GetInquiriesResponseType = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공",
  result: {
    content: [],
    nextCursor: 0,
    hasNext: false,
  },
};

export const createMockGetUserInquiryByIdResponse = (
  inquiryId: number,
  title: string,
  content: string
): GetByIdInquiryResponseType => ({
  isSuccess: true,
  code: "COMMON200",
  message: "성공",
  result: {
    nickname: "테스트유저",
    email: "test@example.com",
    inquiryId,
    title,
    content,
    status: "RECEIVED",
    createdAt: "2025-01-01T00:00:00.000Z",
    imageUrls: [],
    comments: [],
  },
});
