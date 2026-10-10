"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { cn } from "@/utils";
import {
  FIRST_TEMPERATURE,
  MAX_TEMPERATURE,
  TEMPERATURE_CHARACTER,
} from "../../_constants/TEMPERATURE";
import { getTemperatureTier } from "../../_utils/getTemperatureTier/getTemperatureTier";
import TemperatureInfoSheet from "./_internal/TemperatureInfoSheet/TemperatureInfoSheet";

// 그라데이션을 막대 전체 폭 기준으로 깔고 채운 만큼만 보여 줘서, 온도가 높을수록 끝 색이 진해진다.
// 색은 brand subtle disabled(#c2f1d4) → fill brand strong(#00b76e) → fg brand strongUseThis(#009e53) 토큰 값이다.
const GAUGE_GRADIENT = "linear-gradient(to right, #c2f1d4, #00b76e 75%, #009e53)";

const toPercent = (value: number) =>
  (Math.min(Math.max(value, 0), MAX_TEMPERATURE) / MAX_TEMPERATURE) * 100;

interface MyPageTemperatureCardProps {
  temperature: number;
}

/**
 * 마이페이지의 찾길 온도 카드입니다. 온도 구간에 따라 문구, 캐릭터, 색상이 바뀌고,
 * 정보 아이콘을 누르면 온도 구성을 설명하는 바텀시트가 열립니다.
 *
 * @remarks
 * - 36.5 미만이면 수치와 막대를 회색으로 표시합니다.
 * - 99에 도달하면 막대 끝의 손잡이를 숨깁니다.
 *
 * @param temperature 찾길 온도 (0~99)
 *
 * @example
 * ```tsx
 * <MyPageTemperatureCard temperature={36.5} />
 * ```
 */
const MyPageTemperatureCard = ({ temperature }: MyPageTemperatureCardProps) => {
  const t = useTranslations("MyPageTemperatureCard");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const tier = getTemperatureTier(temperature);
  const isLow = tier === "low";
  const percent = toPercent(temperature);

  return (
    <section className="flex w-full flex-col gap-2 rounded-[16px] bg-white px-4 py-5">
      <div className="flex items-center gap-1">
        <h2 className="text-body2-semibold text-layout-header-default">{t("title")}</h2>
        <button
          type="button"
          aria-label={t("infoAriaLabel")}
          onClick={() => setIsInfoOpen(true)}
          className="flex"
        >
          <Icon name="Information" size={16} className="text-layout-body-default" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p
            className={cn(
              "flex items-baseline text-title3-bold",
              isLow ? "text-layout-body-default" : "text-brand-strongUseThis-default"
            )}
          >
            {temperature.toFixed(1)}
            <span className="text-h3-semibold">℃</span>
          </p>
          <p className="text-caption1-regular text-layout-header-default">{t(`message.${tier}`)}</p>
        </div>
        <Image
          src={TEMPERATURE_CHARACTER[tier]}
          alt=""
          width={58}
          height={58}
          className="shrink-0"
        />
      </div>

      <div className="flex flex-col gap-1 pt-2">
        <div className="relative h-4">
          <div className="absolute inset-x-0 top-1 h-2 rounded-full bg-layout_3depth" />
          <div
            className={cn(
              "absolute left-0 top-1 h-2 rounded-full",
              isLow && "bg-labelsVibrant-tertiary"
            )}
            style={{
              width: `${percent}%`,
              ...(!isLow && {
                backgroundImage: GAUGE_GRADIENT,
                backgroundSize: percent > 0 ? `${(100 / percent) * 100}% 100%` : undefined,
              }),
            }}
          />
          {tier !== "max" && (
            <div
              className={cn(
                "absolute top-0 size-4 -translate-x-1/2 rounded-full bg-white",
                isLow
                  ? "shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                  : "shadow-[0_2px_4px_#93DFBA,0_0_2px_#009E53]"
              )}
              style={{ left: `${percent}%` }}
            />
          )}
        </div>

        <div className="relative h-5 text-caption2-regular text-labelsVibrant-secondary">
          <span className="absolute bottom-0 left-0">0℃</span>
          <span
            className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap"
            style={{ left: `${toPercent(FIRST_TEMPERATURE)}%` }}
          >
            <span
              aria-hidden
              className="size-1.5 bg-labelsVibrant-tertiary [clip-path:polygon(50%_0,100%_100%,0_100%)]"
            />
            {t("firstTemperature", { value: FIRST_TEMPERATURE.toFixed(1) })}
          </span>
          <span className="absolute bottom-0 right-0">{MAX_TEMPERATURE}℃</span>
        </div>
      </div>

      <TemperatureInfoSheet isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </section>
  );
};

export default MyPageTemperatureCard;
