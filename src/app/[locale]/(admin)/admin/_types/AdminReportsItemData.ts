export interface AdminReportsItemData {
  href: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: string;

  processStatus: { label: string; className: string };
  answerStatus: { label: string; className: string };
}
