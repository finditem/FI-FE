"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useHorizontalDragScroll } from "@/hooks";
import { cn } from "@/utils";
import {
  CATEGORY,
  FEED_PARAM,
  FEED_PARAM_VALUE,
  MAIN_SEARCH_CHIPS,
  MainSearchChipType,
  PLACE_FILTER_PARAM,
  POST_TYPE,
} from "../HOME_CONST";

/**
 * 칩 타입 -> 이 칩이 여는 바텀시트 모드.
 * - 분실물/발견물: 게시글 피드 시트(`?feed=post` + `?post-type`)
 * - 팝업/카페/맛집: 장소 필터 시트(`?place`)
 */
const CHIP_TO_MODE: Record<MainSearchChipType, { feed: string } | { place: string }> = {
  lost: { feed: "lost" },
  found: { feed: "find" },
  popup: { place: "popup" },
  cafe: { place: "cafe" },
  food: { place: "restaurant" },
};

/** 칩이 여는 바텀시트 모드를 결정하는 파라미터들. 칩 전환 시 함께 비운다. */
const MODE_KEYS = [FEED_PARAM, POST_TYPE, PLACE_FILTER_PARAM, CATEGORY];

const isChipSelected = (
  mode: (typeof CHIP_TO_MODE)[MainSearchChipType],
  params: URLSearchParams
) => {
  if ("place" in mode) return params.get(PLACE_FILTER_PARAM) === mode.place;
  return (
    params.get(FEED_PARAM) === FEED_PARAM_VALUE &&
    params.get(POST_TYPE)?.toLowerCase() === mode.feed
  );
};

/**
 * 메인 홈 검색바 아래 가로 스크롤 필터칩 목록입니다.
 *
 * @remarks
 * - 칩을 누르면 해당 모드의 URL 쿼리를 토글해 바텀시트 내용을 바꿉니다(같은 칩 재클릭 시 해제).
 * - 분실물/발견물은 `?feed=post`(시트 열림) + `?post-type`(타입 필터)을 함께 세팅합니다. 시트 안
 *   필터 행의 "모두보기"는 `?post-type`만 지우므로 전체 피드로 유지됩니다.
 * - 다른 칩으로 전환하면 이전 모드 쿼리와 `?category` 하위 필터를 함께 비웁니다.
 */
const MainSearchChipList = () => {
  const t = useTranslations("MainSearchChipList");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, onMouseDown } = useHorizontalDragScroll();

  const handleClick = (type: MainSearchChipType) => {
    const mode = CHIP_TO_MODE[type];
    const params = new URLSearchParams(searchParams.toString());
    const wasSelected = isChipSelected(mode, params);

    MODE_KEYS.forEach((key) => params.delete(key));

    if (!wasSelected) {
      if ("place" in mode) {
        params.set(PLACE_FILTER_PARAM, mode.place);
      } else {
        params.set(FEED_PARAM, FEED_PARAM_VALUE);
        params.set(POST_TYPE, mode.feed);
      }
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  };

  return (
    <div ref={ref} onMouseDown={onMouseDown} className="flex gap-1 overflow-x-auto no-scrollbar">
      {MAIN_SEARCH_CHIPS.map(({ type, icon }) => {
        const isSelected = isChipSelected(
          CHIP_TO_MODE[type],
          new URLSearchParams(searchParams.toString())
        );

        return (
          <button
            key={type}
            type="button"
            aria-pressed={isSelected}
            onClick={() => handleClick(type)}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full border px-[18px] py-2",
              "whitespace-nowrap text-body1-semibold text-neutralInversed-normal-default",
              "shadow-[0_0_5px_rgba(0,0,0,0.1)] transition-colors",
              isSelected
                ? "border-brand-normal-default bg-fill-brand-subtle-default_2"
                : "border-transparent bg-white"
            )}
          >
            <Image src={icon} alt="" width={16} height={16} draggable={false} />
            {t(type)}
          </button>
        );
      })}
    </div>
  );
};

export default MainSearchChipList;
