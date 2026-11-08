"use client";

import Image from "next/image";
import { cn } from "@/utils";
import "./FourthSection.css";
import { useInView } from "../../../_hooks/useInView/useInView";

const FourthSection = () => {
  const { ref, inView } = useInView();

  return (
    <div className="select-none flex-col-center">
      <Image
        src="/hello/fourth/service-fourth-item-01.svg"
        alt=""
        width={318}
        height={86}
        draggable={false}
        className={cn(inView && "fade-in", "h-[86px] w-[318px] opacity-0")}
      />
      <div ref={ref} />
      <Image
        src="/hello/fourth/service-fourth-item-02.svg"
        alt=""
        width={280}
        height={75}
        draggable={false}
        className="h-[75px] w-[280px]"
      />
    </div>
  );
};

export default FourthSection;
