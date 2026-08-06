import { toReportItemVM, toInquiryItemVM, toGuestInquiryItemVM } from "./toReportsItemVM";
import {
  ProcessStatusBadgeConfig,
  ReplyStatusBadgeConfig,
} from "../AdminStatusBadgeConfig/AdminStatusBadgeConfig";

describe("toReportItemVM", () => {
  it("게시글 신고 매핑", () => {
    const item = {
      reportId: 1,
      reportType: "DUPLICATE",
      reason: "스팸입니다.",
      reporterNickname: "짱구",
      createdAt: "2026-01-01",
      status: "PENDING",
      answered: false,
    } as any;

    const result = toReportItemVM(item);

    expect(result).toEqual({
      href: "/admin/reports/report/1",
      title: "동일한 내용이 여러 번 올라왔어요.",
      content: "스팸입니다.",
      nickname: "짱구",
      createdAt: "2026-01-01",
      processStatus: ProcessStatusBadgeConfig.PENDING,
      answerStatus: ReplyStatusBadgeConfig(false),
    });
  });
});

describe("toInquiryItemVM", () => {
  it("문의 매핑", () => {
    const item = {
      inquiryId: 10,
      title: "로그인 문의",
      content: "",
      nickname: "유리",
      createdAt: "2026-01-02",
      status: "ANSWERED",
      answered: true,
    } as any;

    const result = toInquiryItemVM(item);

    expect(result).toEqual({
      href: "/admin/reports/inquiry/10",
      title: "로그인 문의",
      content: "",
      nickname: "유리",
      createdAt: "2026-01-02",
      processStatus: ProcessStatusBadgeConfig.ANSWERED,
      answerStatus: ReplyStatusBadgeConfig(true),
    });
  });
});

describe("toGuestInquiryItemVM", () => {
  it("비회원 문의 매핑", () => {
    const item = {
      inquiryId: 5,
      title: "비회원 문의",
      content: "문의 내용",
      email: "test@test.com",
      createdAt: "2026-01-03",
      status: "PENDING",
      answered: false,
    } as any;

    const result = toGuestInquiryItemVM(item);

    expect(result).toEqual({
      href: "/admin/guest-inquiries/5",
      title: "비회원 문의",
      content: "문의 내용",
      nickname: "test@test.com",
      createdAt: "2026-01-03",
      processStatus: ProcessStatusBadgeConfig.PENDING,
      answerStatus: ReplyStatusBadgeConfig(false),
    });
  });
});
