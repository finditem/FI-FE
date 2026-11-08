import { ManualKey } from "../_types/ManualType";

export const MANUAL_LIST = [{ key: "LOST" }, { key: "FOUND" }, { key: "STOLEN" }] as const;

type ManualLink = { id: string; href?: string };

export const MANUAL_DATA: Record<ManualKey, ManualLink[]> = {
  LOST: [
    { id: "policeRecord", href: "https://www.lost112.go.kr/" },
    { id: "lostPost", href: "/write/post?type=lost" },
    { id: "policeFoundList", href: "https://www.lost112.go.kr/" },
    { id: "creditCard" },
    { id: "idCard", href: "https://plus.gov.kr" },
    { id: "phone", href: "https://www.handphone.or.kr" },
  ],
  FOUND: [
    { id: "policeRecord", href: "https://www.lost112.go.kr" },
    { id: "foundPost", href: "/write/post?type=find" },
    { id: "foundReport", href: "https://www.lost112.go.kr" },
  ],
  STOLEN: [
    { id: "policeItems", href: "https://www.lost112.go.kr" },
    { id: "cctv", href: "https://www.open.go.kr" },
  ],
};
