import { ReactNode } from "react";

export type ManualItemType = {
  title: string;
  content: ReactNode;
  href?: string;
  btnText?: string;
};

const MANUAL_KEYS = ["LOST", "FOUND", "STOLEN"] as const;
export type ManualKey = (typeof MANUAL_KEYS)[number];
