import { useEffect, useRef } from "react";
import { DefaultSheetContentHeights } from "../../_utils/heightUtils";

const useSectionHeights = (onSectionHeights?: (heights: DefaultSheetContentHeights) => void) => {
  const contentRootRef = useRef<HTMLDivElement>(null);
  const lostFindRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<HTMLDivElement>(null);
  const policeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !onSectionHeights ||
      !contentRootRef.current ||
      !lostFindRef.current ||
      !recentRef.current ||
      !policeRef.current
    ) {
      return;
    }

    const measure = () => {
      const root = contentRootRef.current;
      const lost = lostFindRef.current;
      const recent = recentRef.current;
      const police = policeRef.current;
      if (!root || !lost || !recent || !police) return;

      const upToLostFindActions = lost.offsetTop + lost.offsetHeight;
      const upToRecentFoundItemSection = recent.offsetTop + recent.offsetHeight;
      const upToPoliceSection = police.offsetTop + police.offsetHeight;
      const totalContentHeight = root.scrollHeight;

      onSectionHeights({
        upToLostFindActions,
        upToRecentFoundItemSection,
        upToPoliceSection,
        totalContentHeight,
      });
    };

    measure();

    const observers = [contentRootRef, lostFindRef, recentRef, policeRef].map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(measure);
      observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, [onSectionHeights]);

  return {
    contentRootRef,
    lostFindRef,
    recentRef,
    policeRef,
  };
};

export default useSectionHeights;
