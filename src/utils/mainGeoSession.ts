import { MAIN_GEO_SESSION_KEY } from "@/constants/GEO_SESSION";

export function markMainGeoSessionConfirmed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MAIN_GEO_SESSION_KEY, "1");
  } catch {
    // ignore
  }
}

export function hasMainGeoSessionConfirmed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(MAIN_GEO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearMainGeoSessionConfirmed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(MAIN_GEO_SESSION_KEY);
  } catch {
    // ignore
  }
}
