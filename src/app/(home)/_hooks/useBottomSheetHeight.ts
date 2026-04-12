"use client";

import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { INITIAL_HEIGHT_PX, MIN_HEIGHT_PX } from "../_constants/HEIGHT_PX";
import { MARKER_ID } from "../_constants/QUERY_PARAMS";
import { getMaxHeightPx, getSnapHeights, DefaultSheetContentHeights } from "../_utils/heightUtils";
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
  contentHeights,
}: {
  searchValue: string | null;
  markerId: string | null;
  contentHeights: DefaultSheetContentHeights | null;
}) => {
  const max = getMaxHeightPx();
  const points = getSnapHeights(max, { searchValue, contentHeights, markerId });

  if (searchValue) return max;
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
  const markerSheetSnapSignal = useMainKakaoMapStore((s) => s.markerSheetSnapSignal);
  const height = useMotionValue(INITIAL_HEIGHT_PX);

  useMotionValueEvent(height, "change", (latest: number) => {
    const max = getMaxHeightPx();
    const thresholdPx = max * FULLY_EXPANDED_HEIGHT_RATIO;
    setIsFullyExpanded(latest >= thresholdPx - FULLY_EXPANDED_TOLERANCE_PX);
  });

  useEffect(() => {
    const max = getMaxHeightPx();
    const points = getSnapHeights(max, { searchValue, contentHeights, markerId });
    setSnapHeights(points);
    height.set(getTargetHeight({ searchValue, markerId, contentHeights }));
    setIsInitialized(true);
  }, [searchValue, markerId, contentHeights, markerSheetSnapSignal]);

  useEffect(() => {
    const onResize = () => {
      const max = getMaxHeightPx();
      setSnapHeights(getSnapHeights(max, { searchValue, contentHeights, markerId }));
      height.set(Math.min(height.get(), max));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [height, searchValue, markerId, contentHeights]);

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
