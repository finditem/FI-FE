"use client";

import Image from "next/image";
import { cn } from "@/utils";
import "./SecondSection.css";
import { IMAGES } from "./SECOND_SECTION_IMAGES";
import { useInView } from "../../../_hooks/useInView/useInView";

const SecondSection = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });

  return (
    <div className="relative w-fit select-none">
      <Image
        src="/hello/second/service-second-layout.svg"
        alt=""
        width={196}
        height={405}
        draggable={false}
        className="relative z-10"
        priority
      />

      <div ref={ref} />
      {IMAGES.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt=""
          width={178}
          height={405}
          draggable={false}
          priority={index === 0}
          className={cn(
            "absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2",
            index === 0 ? inView && "fade-out-once" : "fade-in-once"
          )}
        />
      ))}
    </div>
  );
};

export default SecondSection;
