"use client";

import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  INITIAL_HEIGHT_PX,
  MIN_HEIGHT_PX,
  MARKER_ID,
  PLACE_FILTER_PARAM,
  FEED_PARAM,
} from "../../_components/HOME_CONST";
import {
  getMaxHeightPx,
  getSnapHeights,
  DefaultSheetContentHeights,
} from "../../_utils/heightUtils";
import { useMainKakaoMapStore } from "@/store";

const FULLY_EXPANDED_HEIGHT_RATIO = 0.8;
const FULLY_EXPANDED_TOLERANCE_PX = 2;

interface PointerHandlerEvent {
  currentTarget: EventTarget & HTMLElement;
  pointerId: number;
  clientY: number;
}

const getTargetHeight = ({
  searchValue,
  markerId,
  placeParam,
  feedParam,
  contentHeights,
}: {
  searchValue: string | null;
  markerId: string | null;
  placeParam: string | null;
  feedParam: string | null;
  contentHeights: DefaultSheetContentHeights | null;
}) => {
  const max = getMaxHeightPx();
  const points = getSnapHeights(max, {
    searchValue,
    contentHeights,
    markerId,
    placeParam,
    feedParam,
  });

  if (searchValue) return max;
  if (placeParam) return points[1];
  if (feedParam) return points[1];
  if (contentHeights && !markerId) return points[1];
  return points[2];
};

const useBottomSheetHeight = (contentHeights: DefaultSheetContentHeights | null = null) => {
  const [snapHeights, setSnapHeights] = useState<number[]>([]);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const moveListenerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");
  const markerId = searchParams.get(MARKER_ID);
  const placeParam = searchParams.get(PLACE_FILTER_PARAM);
  const feedParam = searchParams.get(FEED_PARAM);
  const markerSheetSnapSignal = useMainKakaoMapStore((s) => s.markerSheetSnapSignal);
  const placeSheetCollapseSignal = useMainKakaoMapStore((s) => s.placeSheetCollapseSignal);
  const height = useMotionValue(INITIAL_HEIGHT_PX);

  useMotionValueEvent(height, "change", (latest: number) => {
    const max = getMaxHeightPx();
    const thresholdPx = max * FULLY_EXPANDED_HEIGHT_RATIO;
    setIsFullyExpanded(latest >= thresholdPx - FULLY_EXPANDED_TOLERANCE_PX);
  });

  useEffect(() => {
    const max = getMaxHeightPx();
    const points = getSnapHeights(max, {
      searchValue,
      contentHeights,
      markerId,
      placeParam,
      feedParam,
    });
    setSnapHeights(points);
    height.set(getTargetHeight({ searchValue, markerId, placeParam, feedParam, contentHeights }));
    setIsInitialized(true);
  }, [searchValue, markerId, placeParam, feedParam, contentHeights, markerSheetSnapSignal]);

  // 장소 필터 시트의 "지도" 버튼: 시트를 최소 높이로 접는다.
  useEffect(() => {
    if (placeSheetCollapseSignal === 0) return;
    animate(height, MIN_HEIGHT_PX, { type: "spring", stiffness: 300, damping: 35 });
  }, [placeSheetCollapseSignal, height]);

  useEffect(() => {
    const onResize = () => {
      const max = getMaxHeightPx();
      setSnapHeights(
        getSnapHeights(max, { searchValue, contentHeights, markerId, placeParam, feedParam })
      );
      height.set(Math.min(height.get(), max));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [height, searchValue, markerId, placeParam, feedParam, contentHeights]);

  const snapToClosestHeight = (currentHeight: number) => {
    if (!snapHeights.length) return;

    const closest = snapHeights.reduce((prev, curr) =>
      Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev
    );

    animate(height, closest, {
      type: "spring",
      stiffness: 300,
      damping: 35,
    });
  };

  const handlePointerDown = (e: PointerHandlerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const startY = e.clientY;
    const startHeight = height.get();

    const onPointerMove = (moveEvent: PointerEvent) => {
      const delta = startY - moveEvent.clientY;
      const maxH = getMaxHeightPx();
      const newHeight = Math.min(maxH, Math.max(MIN_HEIGHT_PX, startHeight + delta));
      height.set(newHeight);
    };

    moveListenerRef.current = onPointerMove;
    document.addEventListener("pointermove", onPointerMove);
  };

  const handlePointerUp = (e: PointerHandlerEvent) => {
    const currentHeight = height.get();
    snapToClosestHeight(currentHeight);
    e.currentTarget.releasePointerCapture(e.pointerId);
    const listener = moveListenerRef.current;
    if (listener) {
      document.removeEventListener("pointermove", listener);
      moveListenerRef.current = null;
    }
  };

  return { height, isFullyExpanded, isInitialized, handlePointerDown, handlePointerUp };
};

export default useBottomSheetHeight;
