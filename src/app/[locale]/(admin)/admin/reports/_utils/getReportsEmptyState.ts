import { ReportsTabType } from "../_types/ReportsTabType";

export const getReportsEmptyState = (activeTab: ReportsTabType, hasKeyword: boolean) => {
  if (activeTab === "report") {
    return hasKeyword
      ? ({
          icon: { iconName: "NoReports", iconSize: 70 },
          title: "선택한 조건에 맞는 신고 내역이 없어요",
          description:
            "선택하신 조건에 해당하는 신고 내역이 없습니다.\n다른 조건으로 다시 조회해 주세요.",
        } as const)
      : ({
          icon: { iconName: "NoReports", iconSize: 70 },
          title: "신고 내역이 없어요",
          description: "아직 신고 내역이 없습니다.\n신고가 접수되면 이곳에 표기됩니다.",
        } as const);
  }

  return hasKeyword
    ? ({
        icon: { iconName: "NoInquiries", iconSize: 70 },
        title: "선택한 조건에 맞는 문의 내역이 없어요",
        description:
          "선택하신 조건에 해당하는 문의 내역이 없습니다.\n다른 조건으로 다시 조회해 주세요.",
      } as const)
    : ({
        icon: { iconName: "NoInquiries", iconSize: 70 },
        title: "문의 내역이 없어요",
        description: "아직 문의 내역이 없습니다.\n문의가 접수되면 이곳에 표기됩니다.",
      } as const);
};
