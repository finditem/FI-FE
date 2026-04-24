import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT_SEARCH_COUNT = 10;

const normalizeKeyword = (keyword: string) => keyword.trim();

/**
 * 메인 검색에서 최근 항목으로 저장하는 한 줄 레코드입니다.
 */
export type MainRecentSearchItem = {
  /** 트림된 검색어 */
  keyword: string;
  /** 검색 실행 시각(ISO 8601, 로컬 스토리지에 저장) */
  searchedAt: string;
};

type PersistedLegacyV0 = {
  recentKeywords?: string[];
  recentItems?: MainRecentSearchItem[];
};

/**
 * 메인 페이지 검색의 최근 검색어 목록을 전역으로 들고, 새로고침 후에도 유지합니다.
 *
 * @remarks
 * - `persist`의 `recentItems`만 저장하고, `version`·`migrate`로 구버전 `recentKeywords` 배열을 `recentItems`로 승격합니다.
 * - 같은 키워드를 다시 넣으면 맨 앞으로 옮기고 `searchedAt`만 새로 찍습니다.
 * - 개수는 파일 상단 상수(최대 개수)를 넘지 않게 자릅니다.
 * - 빈 문자열·공백만 있는 입력은 무시합니다.
 *
 * @author hyungjun
 */
interface MainRecentSearchStore {
  /** 최신순 최근 검색 목록 */
  recentItems: MainRecentSearchItem[];
  /** 키워드 추가·중복 시 앞으로 이동·시각 갱신 */
  addRecentSearch: (keyword: string) => void;
  /** 해당 키워드와 일치하는 항목만 제거 */
  removeRecentSearch: (keyword: string) => void;
  /** 목록 전체 비우기 */
  clearRecentSearch: () => void;
}

/**
 * @example
 * ```ts
 * const { recentItems, addRecentSearch, clearRecentSearch } = useMainRecentSearch();
 * addRecentSearch("열쇠");
 * clearRecentSearch();
 * ```
 */

export const useMainRecentSearch = create<MainRecentSearchStore>()(
  persist(
    (set, get) => ({
      recentItems: [],
      addRecentSearch: (keyword) => {
        const trimmed = normalizeKeyword(keyword);
        if (!trimmed) return;

        const searchedAt = new Date().toISOString();

        set(() => {
          const prev = get().recentItems;
          const withoutDup = prev.filter((item) => item.keyword !== trimmed);
          const next = [{ keyword: trimmed, searchedAt }, ...withoutDup].slice(
            0,
            MAX_RECENT_SEARCH_COUNT
          );
          return { recentItems: next };
        });
      },
      removeRecentSearch: (keyword) => {
        const trimmed = normalizeKeyword(keyword);
        if (!trimmed) return;

        set({
          recentItems: get().recentItems.filter((item) => item.keyword !== trimmed),
        });
      },
      clearRecentSearch: () => set({ recentItems: [] }),
    }),
    {
      name: "main-recent-search",
      version: 1,
      migrate: (persistedState, version): Pick<MainRecentSearchStore, "recentItems"> => {
        if (version === 0) {
          const legacy = persistedState as PersistedLegacyV0 | undefined;
          if (legacy?.recentItems && Array.isArray(legacy.recentItems)) {
            return { recentItems: legacy.recentItems };
          }
          if (legacy?.recentKeywords && Array.isArray(legacy.recentKeywords)) {
            const fallbackAt = new Date().toISOString();
            return {
              recentItems: legacy.recentKeywords.map((k) => ({
                keyword: k,
                searchedAt: fallbackAt,
              })),
            };
          }
        }
        const next = persistedState as Pick<MainRecentSearchStore, "recentItems"> | undefined;
        return { recentItems: next?.recentItems ?? [] };
      },
      partialize: (state) => ({ recentItems: state.recentItems }),
    }
  )
);
