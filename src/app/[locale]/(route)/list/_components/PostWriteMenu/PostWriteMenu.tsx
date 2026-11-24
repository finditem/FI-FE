"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { FindWarningModal, FloatingButton, Icon, ScrollToTopButton } from "@/components";
import { cn } from "@/utils";
import { useClickOutside } from "@/hooks";
import { WRITE_MENU_STYLES } from "../LIST_CONST";
import { trackClickWriteButton } from "@/utils/analytics/analytics";

const PostWriteMenu = () => {
  const t = useTranslations("PostWriteMenu");
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
                <Link
                  href={"/write/post?type=lost"}
                  className={WRITE_MENU_STYLES.menuButton}
                  onClick={() => trackClickWriteButton("list")}
                >
                  <Icon name="LostWriteBtn" size={20} />
                  <span className={WRITE_MENU_STYLES.menuLabel}>{t("lostWriteLabel")}</span>
                </Link>
                <hr className="h-px w-full bg-white" />
                <button className={WRITE_MENU_STYLES.menuButton} onClick={handleClickFindButton}>
                  <Icon name="FindWriteBtn" size={20} />
                  <span className={WRITE_MENU_STYLES.menuLabel}>{t("foundWriteLabel")}</span>
                </button>
              </div>
            </div>
          )}

          <FloatingButton
            ariaLabel={t("menuAriaLabel")}
            buttonClassName={cn(isMenuOpen && "bg-fill-brand-strong-pressed", "transition-colors")}
            iconClassName={cn(isMenuOpen && "rotate-45", "transition-transform")}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
        </div>
      </div>

      <FindWarningModal
        isOpen={isFindModalOpen}
        onClose={() => setIsFindModalOpen(false)}
        location="list"
      />
    </>
  );
};

export default PostWriteMenu;
