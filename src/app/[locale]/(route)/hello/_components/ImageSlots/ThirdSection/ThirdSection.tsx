"use client";

import Image, { ImageProps } from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import {
  PHONE,
  CHAT_ITEMS,
  CHAT_STACK_LEFT,
  CHAT_LAST,
  SIDE_MESSAGES,
} from "./THIRD_SECTION_PARTS";
import "./ThirdSection.css";
import { useInView } from "../../../_hooks/useInView/useInView";

const ThirdSection = () => {
  const t = useTranslations("HelloPage.imageAlt");
  const { ref, inView } = useInView();

  return (
    <div className="w-full select-none flex-center">
      <div className="relative">
        <Image
          src={PHONE.src}
          // 채팅방 캡처만 내용을 설명하고, 위에 겹쳐 움직이는 말풍선 조각은 장식이라 비워둔다.
          alt={t("chatRoom")}
          width={PHONE.width}
          height={PHONE.height}
          draggable={false}
          className="relative z-10 h-[270px] w-[200px]"
        />

        <div
          ref={ref}
          className="absolute inset-x-0 top-[calc(50%+30px)] z-20 flex w-full -translate-y-1/2 flex-col px-[14px]"
        >
          {CHAT_ITEMS.map((item, index) => (
            <ImagePart
              key={item.src}
              {...item}
              className={cn(item.className, inView && "chat-animate")}
              style={{
                animationDelay: `${index * 0.4}s`,
              }}
            />
          ))}

          <div className="mt-[7px] flex flex-col items-start gap-[3px]">
            {CHAT_STACK_LEFT.map((item, index) => (
              <ImagePart
                key={item.src}
                {...item}
                className={cn(inView && "chat-animate")}
                style={{
                  animationDelay: `${index * 0.4 + 1}s`,
                }}
              />
            ))}
          </div>

          <ImagePart
            {...CHAT_LAST}
            className={cn(CHAT_LAST.className, inView && "chat-animate")}
            style={{
              animationDelay: "2.4s",
            }}
          />
        </div>

        {SIDE_MESSAGES.map((message) => (
          <ImagePart key={message.src} {...message} />
        ))}
      </div>
    </div>
  );
};

export default ThirdSection;

const ImagePart = (props: Omit<ImageProps, "alt">) => {
  return <Image alt="" {...props} />;
};
