export const CATEGORY_OPTIONS = [
  { value: "ELECTRONICS", label: "전자기기" },
  { value: "WALLET", label: "지갑" },
  { value: "ID_CARD", label: "신분증" },
  { value: "JEWELRY", label: "귀금속" },
  { value: "BAG", label: "가방" },
  { value: "CARD", label: "카드" },
  { value: "ETC", label: "기타" },
] as const;

export const NOTICE_WRITE_CATEGORY_OPTIONS = [
  { value: "IMPORTANT", label: "중요" },
  { value: "UPDATE", label: "업데이트" },
  { value: "MAINTENANCE", label: "점검" },
  { value: "EVENT", label: "이벤트" },
  { value: "GENERAL", label: "일반" },
] as const;

export const INQUIRY_WRITE_CATEGORY_OPTIONS = [
  { value: "ACCOUNT_LOGIN", label: "계정" },
  { value: "USAGE", label: "이용방법" },
  { value: "ETC", label: "기타" },
] as const;
