"use client";

import { motion } from "framer-motion";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BOTTOM_OFFSET_PX,
  FEED_PARAM,
  FEED_PARAM_VALUE,
  MARKER_ID,
  PLACE_FILTER_PARAM,
  PLACE_FILTER_TO_CATEGORY,
  PLACE_FILTER_VALUES,
  PLACE_ID_PARAM,
} from "../HOME_CONST";
import type { PlaceFilterValue } from "../HOME_CONST";
import useBottomSheetHeight from "../../_hooks/useBottomSheetHeight/useBottomSheetHeight";
import MyLocationButton from "../MyLocationButton/MyLocationButton";
import DefaultSheetContent from "../DefaultSheetContent/DefaultSheetContent";
import PostSheetContent from "../PostSheetContent/PostSheetContent";
import MapPostSummarySheetContent from "../MapPostSummarySheetContent/MapPostSummarySheetContent";
import PlaceFilterSheetContent from "../PlaceFilterSheetContent/PlaceFilterSheetContent";
import PlaceDetailSheetContent from "../PlaceDetailSheetContent/PlaceDetailSheetContent";
import PostTypeSheetContent from "../PostTypeSheetContent/PostTypeSheetContent";
import { DefaultSheetContentHeights } from "../../_utils/heightUtils";
import PermissionSheet from "../PermissionBottomSheet/PermissionBottomSheet";
import { usePermissionStore } from "@/store";
import { cn } from "@/utils";

const BottomSheetContent = () => {
  const t = useTranslations("BottomSheet");
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");
  const markerId = searchParams.get(MARKER_ID);
  const placeParamRaw = searchParams.get(PLACE_FILTER_PARAM);
  const placeValue = (PLACE_FILTER_VALUES as readonly string[]).includes(placeParamRaw ?? "")
    ? (placeParamRaw as PlaceFilterValue)
    : null;
  const placeIdParam = Number(searchParams.get(PLACE_ID_PARAM));
  const selectedPlaceId = placeValue && placeIdParam > 0 ? placeIdParam : null;
  const isFeedMode =
    !searchValue && !markerId && !placeValue && searchParams.get(FEED_PARAM) === FEED_PARAM_VALUE;
  const [contentHeights, setContentHeights] = useState<DefaultSheetContentHeights | null>(null);
  const { height, isFullyExpanded, isInitialized, handlePointerDown, handlePointerUp } =
    useBottomSheetHeight(contentHeights);
  const isDefaultMode = !searchValue && !markerId && !placeValue && !isFeedMode;
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
          aria-label={t("heightAdjustLabel")}
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
          ) : placeValue && selectedPlaceId ? (
            <PlaceDetailSheetContent
              placeId={selectedPlaceId}
              placeType={PLACE_FILTER_TO_CATEGORY[placeValue]}
            />
          ) : placeValue ? (
            <PlaceFilterSheetContent placeValue={placeValue} />
          ) : isFeedMode ? (
            <PostTypeSheetContent />
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
