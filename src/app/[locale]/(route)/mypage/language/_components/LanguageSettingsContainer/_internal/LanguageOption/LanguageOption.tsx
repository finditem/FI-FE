import Image from "next/image";
import { cn } from "@/utils";

interface LanguageOptionProps {
  locale: string;
  flagSrc: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const LanguageOption = ({ locale, flagSrc, label, selected, onSelect }: LanguageOptionProps) => {
  return (
    <label
      className={cn(
        "flex h-[60px] w-full cursor-pointer items-center justify-between px-5 py-2",
        selected && "bg-fill-neutral-strong-hover"
      )}
    >
      <span className="flex items-center gap-3">
        <Image src={flagSrc} alt="" width={36} height={36} className="shrink-0 rounded-full" />
        <span className="text-body1-medium text-layout-header-default">{label}</span>
      </span>
      <input
        type="radio"
        name="mypage-language"
        value={locale}
        checked={selected}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative size-6 shrink-0 rounded-full border-[1.5px] border-neutral-normal-default",
          "before:absolute before:inset-[6px] before:scale-0 before:rounded-full before:bg-white before:transition-transform",
          "peer-checked:border-transparent peer-checked:bg-fill-brand-normal-enteredSelected peer-checked:before:scale-100"
        )}
      />
    </label>
  );
};

export default LanguageOption;
