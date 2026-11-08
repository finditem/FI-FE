"use client";

import { useEffect, useRef, useState } from "react";

type InViewTarget = HTMLDivElement | HTMLImageElement;

export const useInView = ({
  threshold = 0.5,
  root = null,
  rootMargin = "0px",
}: IntersectionObserverInit = {}) => {
  const ref = useRef<InViewTarget | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return { ref, inView };
};
