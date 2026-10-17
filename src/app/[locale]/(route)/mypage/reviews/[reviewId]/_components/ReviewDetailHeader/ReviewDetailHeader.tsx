"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components";

interface ReviewDetailHeaderProps {
  title: string;
  backAriaLabel: string;
}

const ReviewDetailHeader = ({ title, backAriaLabel }: ReviewDetailHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    const historyCount = parseInt(sessionStorage.getItem("__fmi_history_count") || "0", 10);

    if (historyCount > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <header className="flex h-[calc(56px+var(--safe-area-top))] items-center gap-2 px-5 pt-[var(--safe-area-top)] text-white">
      <button
        type="button"
        className="size-[30px] flex-center"
        aria-label={backAriaLabel}
        onClick={handleBack}
      >
        <Icon name="ArrowLeftSmall" size={30} className="text-white" />
      </button>
      <h1 className="text-h3-semibold">{title}</h1>
    </header>
  );
};

export default ReviewDetailHeader;
