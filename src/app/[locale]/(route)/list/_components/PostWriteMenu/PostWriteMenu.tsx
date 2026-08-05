"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, FloatingButton, Icon, ScrollToTopButton, ModalLayout } from "@/components";
import { cn } from "@/utils";
import { useClickOutside } from "@/hooks";
import { WRITE_MENU_STYLES } from "../LIST_CONST";

const PostWriteMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);

  const containerRef = useClickOutside(() => setIsMenuOpen(false));

  const params = useParams();
  if (params.id) return null;

  const handleClickFindButton = () => {
    setIsMenuOpen(false);
    setIsFindModalOpen(true);
  };

  return (
    <>
      <div ref={containerRef} className="gap-2 flex-col-center fixed-button-position">
        <ScrollToTopButton />

        <div className="relative flex justify-end">
          {isMenuOpen && (
            <div className="absolute bottom-[65px] left-1/2 mb-3 -translate-x-[85%]">
              <div className="glass-card w-[213px] overflow-hidden text-nowrap rounded-[20px] border border-white">
                <Link href={"/write/post?type=lost"} className={WRITE_MENU_STYLES.menuButton}>
                  <Icon name="LostWriteBtn" size={20} />
                  <span className={WRITE_MENU_STYLES.menuLabel}>분실했어요 글쓰기</span>
                </Link>
                <hr className="h-px w-full bg-white" />
                <button className={WRITE_MENU_STYLES.menuButton} onClick={handleClickFindButton}>
                  <Icon name="FindWriteBtn" size={20} />
                  <span className={WRITE_MENU_STYLES.menuLabel}>발견했어요 글쓰기</span>
                </button>
              </div>
            </div>
          )}

          <FloatingButton
            ariaLabel="글쓰기 메뉴"
            buttonClassName={cn(isMenuOpen && "bg-fill-brand-strong-pressed", "transition-colors")}
            iconClassName={cn(isMenuOpen && "rotate-45", "transition-transform")}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
        </div>
      </div>

      <FindWarningModal isOpen={isFindModalOpen} onClose={() => setIsFindModalOpen(false)} />
    </>
  );
};

export default PostWriteMenu;

interface FindWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindWarningModal = ({ isOpen, onClose }: FindWarningModalProps) => {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="min-h-[186px] w-[350px] gap-6 p-6 flex-col-center"
    >
      <div className="gap-1 flex-col-center">
        <h2 className="text-h3-semibold text-layout-header-default">
          게시글 작성 전 확인해 주세요!
        </h2>
        <span className="text-body5-regular text-center text-layout-body-default">
          발견했어요 게시글 작성 시에는 경찰청에 우선 신고해 주시고 작성해 주시기 바랍니다.
        </span>
      </div>

      <div className="flex w-full gap-2">
        <Button variant="outlined" className={WRITE_MENU_STYLES.findModalButton} onClick={onClose}>
          취소
        </Button>
        <Button
          as={Link}
          href="/write/post?type=find"
          className={WRITE_MENU_STYLES.findModalButton}
        >
          글쓰기
        </Button>
      </div>
    </ModalLayout>
  );
};
