"use client";

import Link from "next/link";
import { cn } from "@/utils";
import { Button, Icon } from "@/components/common";
import { ManualItemType } from "../../_types/ManualType";
import { MANUAL_DATA } from "../../_constants/MANUAL_CONSTANT";

interface ManualListProps {
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  selected: keyof typeof MANUAL_DATA;
}

const ManualList = ({ openIndex, setOpenIndex, selected }: ManualListProps) => {
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full">
      <ul>
        {MANUAL_DATA[selected].map((item: ManualItemType, index: number) => (
          <ManualItem
            key={item.title}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </ul>
    </section>
  );
};

interface ManualItemProps {
  item: ManualItemType;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ManualItem = ({ item, isOpen, onToggle }: ManualItemProps) => {
  const { title, content, href, btnText } = item;

  return (
    <li>
      <button
        type="button"
        aria-expanded={!!isOpen}
        aria-controls="manual-item-panel"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between border-b border-neutral-normal-default px-[20px] py-[26px]"
      >
        <span className="text-body1-semibold text-neutral-normal-default">{title}</span>
        <span className={cn("transition-transform duration-200", isOpen && "rotate-180")}>
          <Icon name="ArrowDown" />
        </span>
      </button>
      <div
        className={cn(
          "grid w-full transition-all duration-300 bg-fill-neutral-strong-default",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col items-start justify-center px-[20px] py-[24px] text-body2-regular text-layout-body-default">
            <p className="mb-[26px]">{content}</p>
            {href && (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-[6px] rounded-[10px] border border-neutral-normal-default bg-white py-[10px] text-center text-body2-semibold text-neutral-normal-default"
              >
                {btnText}
                <Icon name="ArrowRightSmall" size={20} className="text-neutral-normal-default" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ManualList;
