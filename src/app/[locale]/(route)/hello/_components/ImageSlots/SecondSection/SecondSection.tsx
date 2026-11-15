"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import "./SecondSection.css";
import { IMAGES } from "./SECOND_SECTION_IMAGES";
import { useInView } from "../../../_hooks/useInView/useInView";

const SecondSection = () => {
  const t = useTranslations("HelloPage.imageAlt");
  const { ref, inView } = useInView({ threshold: 0.5 });
  // 앱 화면 캡처는 기능을 설명하는 이미지라 내용을 alt로 적는다. 휴대폰 테두리는 장식이라 비워둔다.
  const imageAlts = [t("browseList"), t("browseDetail")];

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
          alt={imageAlts[index]}
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
