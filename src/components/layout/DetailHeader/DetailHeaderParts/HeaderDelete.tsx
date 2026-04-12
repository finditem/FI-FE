"use client";

import { Icon } from "@/components/common";

interface HeaderDeleteProps {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
  disabled?: boolean;
}

const HeaderDelete = ({ isDeleteMode, setIsDeleteMode, disabled = false }: HeaderDeleteProps) => {
  return (
    <button
      type="button"
      aria-label={isDeleteMode ? "삭제 화면 취소" : "삭제 화면 진입"}
      onClick={() => setIsDeleteMode(!isDeleteMode)}
      disabled={disabled}
      className="disabled:cursor-not-allowed disabled:opacity-40"
    >
      {!isDeleteMode ? (
        <Icon name="Trash" size={24} className="text-neutral-normal-default" />
      ) : (
        <span className="text-h3-medium text-layout-header-default">취소</span>
      )}
    </button>
  );
};

export default HeaderDelete;
