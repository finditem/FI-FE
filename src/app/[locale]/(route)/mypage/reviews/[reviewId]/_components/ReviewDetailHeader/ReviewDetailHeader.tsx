"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components";

interface ReviewDetailHeaderProps {
  title: string;
  backAriaLabel: string;
}

const ReviewDetailHeader = ({ title, backAriaLabel }: ReviewDetailHeaderProps) => {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center gap-2 px-5 pt-[var(--safe-area-top)] text-white">
      <button
        type="button"
        className="flex size-[30px] items-center justify-center"
        aria-label={backAriaLabel}
        onClick={() => router.back()}
      >
        <Icon name="ArrowLeftSmall" size={30} className="text-white" />
      </button>
      <h1 className="text-h3-semibold">{title}</h1>
    </header>
  );
};

export default ReviewDetailHeader;
