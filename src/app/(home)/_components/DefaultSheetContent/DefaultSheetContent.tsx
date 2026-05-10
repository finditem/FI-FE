"use client";

import {
  LostFindActions,
  PoliceSection,
  RecentFoundItemSection,
  SupportLinkSection,
} from "./_internal";
import { useSectionHeights } from "../../_hooks";
import { DefaultSheetContentHeights } from "../../_utils/heightUtils";
import { cn } from "@/utils";

interface DefaultSheetContentProps {
  onSectionHeights?: (heights: DefaultSheetContentHeights) => void;
}

const DIVIDER_STYLE = "w-full border-0 border-solid border-t-[0.7px] border-divider-default";

const DefaultSheetContent = ({ onSectionHeights }: DefaultSheetContentProps) => {
  const refs = useSectionHeights(onSectionHeights);

  return (
    <div className="space-y-5">
      <div ref={refs.lostFindRef}>
        <LostFindActions />
      </div>

      <div ref={refs.recentRef}>
        <RecentFoundItemSection />
        <hr className={cn("my-5", DIVIDER_STYLE)} />
      </div>

      <div ref={refs.policeRef}>
        <PoliceSection />
      </div>

      <hr className={DIVIDER_STYLE} />
      <SupportLinkSection />
    </div>
  );
};

export default DefaultSheetContent;
