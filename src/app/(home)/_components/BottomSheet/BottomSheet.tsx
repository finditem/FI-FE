"use client";

import { motion } from "framer-motion";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BOTTOM_OFFSET_PX } from "../../_constants/HEIGHT_PX";
import { useBottomSheetHeight } from "../../_hooks";
import MyLocationButton from "../MyLocationButton/MyLocationButton";
import DefaultSheetContent from "../DefaultSheetContent/DefaultSheetContent";
import PostSheetContent from "../PostSheetContent/PostSheetContent";
import MapPostSummarySheetContent from "../MapPostSummarySheetContent/MapPostSummarySheetContent";
import { DefaultSheetContentHeights } from "../../_utils/heightUtils";
import { MARKER_ID } from "../../_constants/QUERY_PARAMS";
import PermissionSheet from "../PermissionBottomSheet/PermissionBottomSheet";
import { usePermissionStore } from "@/store";
import { cn } from "@/utils";

const BottomSheetContent = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");
  const markerId = searchParams.get(MARKER_ID);
  const [contentHeights, setContentHeights] = useState<DefaultSheetContentHeights | null>(null);
  const { height, isFullyExpanded, isInitialized, handlePointerDown, handlePointerUp } =
    useBottomSheetHeight(contentHeights);
  const isDefaultMode = !searchValue && !markerId;
  const isBottomSheetReady = isInitialized && (!isDefaultMode || contentHeights !== null);

  const handleSectionHeights = useCallback((heights: DefaultSheetContentHeights) => {
    setContentHeights(heights);
  }, []);

  return (
    <motion.div
      style={{ height, bottom: `${BOTTOM_OFFSET_PX}px` }}
      className={cn(
        "fixed left-0 right-0 z-50 mx-auto max-w-[768px] select-none border-x-2",
        !isBottomSheetReady && "pointer-events-none invisible"
      )}
      aria-hidden={!isBottomSheetReady}
    >
      {!isFullyExpanded && (
        <div className="relative">
          <MyLocationButton />
        </div>
      )}

      <div className="flex h-full flex-col overflow-hidden rounded-t-[20px] bg-white">
        <div
          role="button"
          aria-label="바텀시트 높이 조절"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex shrink-0 cursor-grab touch-none justify-center pb-5 pt-3"
        >
          <div className="h-[3px] w-[50px] rounded-full bg-labelsVibrant-primary" />
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-5 pb-[18px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {searchValue ? (
            <PostSheetContent />
          ) : markerId ? (
            <MapPostSummarySheetContent />
          ) : (
            <DefaultSheetContent onSectionHeights={handleSectionHeights} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BottomSheet = () => {
  const router = useRouter();
  const { isFirstSignUp } = usePermissionStore();
  const [isPermissionSheetOpen, setIsPermissionSheetOpen] = useState(false);

  useEffect(() => {
    if (isFirstSignUp) {
      setIsPermissionSheetOpen(true);
    }
  }, [isFirstSignUp]);

  return (
    <Suspense fallback="">
      {isPermissionSheetOpen ? (
        <PermissionSheet
          isOpen={isPermissionSheetOpen}
          onClose={() => {
            router.replace("/");
            setIsPermissionSheetOpen(false);
          }}
        />
      ) : (
        <BottomSheetContent />
      )}
    </Suspense>
  );
};

export default BottomSheet;
