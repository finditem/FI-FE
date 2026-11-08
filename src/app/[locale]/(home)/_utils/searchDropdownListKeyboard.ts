import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

const DROPDOWN_ITEM_SELECTOR = "[data-search-dropdown-item]";

const getSearchDropdownItems = (root: Element | null): HTMLElement[] => {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(DROPDOWN_ITEM_SELECTOR));
};

export const focusSearchDropdownBoundary = (
  root: HTMLElement | null,
  direction: "first" | "last"
): boolean => {
  const items = getSearchDropdownItems(root);
  if (items.length === 0) return false;
  (direction === "first" ? items[0] : items[items.length - 1])?.focus();
  return true;
};

export const handleSearchDropdownRowKeyDown = (
  e: ReactKeyboardEvent<HTMLElement>,
  dropdownRootRef: RefObject<HTMLElement | null>,
  searchInputRef: RefObject<HTMLInputElement | null>
): void => {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

  const root = dropdownRootRef.current;
  if (!root) return;

  const items = getSearchDropdownItems(root);
  const idx = items.indexOf(e.currentTarget);
  if (idx < 0) return;

  if (e.key === "ArrowDown") {
    const next = items[idx + 1];
    if (next) {
      e.preventDefault();
      next.focus();
    } else {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    return;
  }

  const prev = items[idx - 1];
  if (prev) {
    e.preventDefault();
    prev.focus();
  } else {
    e.preventDefault();
    searchInputRef.current?.focus();
  }
};
