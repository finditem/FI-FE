import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getExpandedIdFromHash, getFaqAnchorId } from "./supportFaqAccordionUtils";

const useSupportFaqAccordion = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setExpandedId(getExpandedIdFromHash());
    const syncHash = () => setExpandedId(getExpandedIdFromHash());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const handleToggle = (itemId: number) => {
    const next = expandedId === itemId ? null : itemId;
    setExpandedId(next);
    const qs = searchParams.toString();
    const base = qs ? `${pathname}?${qs}` : pathname;
    router.replace(next !== null ? `${base}#${getFaqAnchorId(itemId)}` : base, {
      scroll: false,
    });
  };

  return { expandedId, handleToggle };
};

export default useSupportFaqAccordion;
