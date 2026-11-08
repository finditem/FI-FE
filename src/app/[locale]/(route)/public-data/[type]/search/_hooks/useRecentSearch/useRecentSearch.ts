import { useState, useEffect } from "react";
import { RecentSearchItem } from "../../_types/PublicRecentSearchItem";

const key = "public_data_recent_search";

export const useRecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        // no-op
      }
    }
  }, [key]);

  const addSearch = (keyword: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.keyword !== keyword);
      const newSearches = [{ keyword, timestamp: Date.now() }, ...filtered].slice(0, 10);

      localStorage.setItem(key, JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const removeSearch = (keyword: string) => {
    setRecentSearches((prev) => {
      const newSearches = prev.filter((item) => item.keyword !== keyword);
      localStorage.setItem(key, JSON.stringify(newSearches));
      return newSearches;
    });
  };

  return { recentSearches, addSearch, removeSearch };
};

export default useRecentSearch;
