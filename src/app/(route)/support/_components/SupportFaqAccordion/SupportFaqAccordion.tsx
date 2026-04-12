"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button, Chip, Icon } from "@/components/common";
import { cn } from "@/utils";
import {
  FAQ_ITEMS,
  FaqItem,
  useSupportFaqAccordion,
  getFaqAnchorId,
  filterFaqItemsByTab,
} from "./_internal";
import { useSupportTabQuery } from "../SupportTab/_internal/useSupportTabQuery";
import { MouseEvent } from "react";
import Link from "next/link";

interface SupportFaqAccordionItemProps {
  item: FaqItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const SupportFaqAccordionItem = ({ item, isExpanded, onToggle }: SupportFaqAccordionItemProps) => {
  const id = getFaqAnchorId(item.id);

  const onAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onToggle();
    if (isExpanded) return;
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  return (
    <li id={id}>
      <div className="flex scroll-mt-14 flex-col border-b border-neutral-normal-default">
        <a
          href={`#${id}`}
          aria-label="FAQ 질문 접기/펼치기"
          aria-expanded={isExpanded}
          onClick={onAnchorClick}
          className="flex items-center justify-between px-5 py-[26px]"
        >
          <p
            className={cn(
              "flex-1 text-body1-semibold text-neutral-normal-default",
              isExpanded && "text-neutral-normal-enteredSelected"
            )}
          >
            {item.question}
          </p>
          <Icon
            name="ArrowDownSmall"
            size={24}
            className={cn("transition-all", isExpanded && "rotate-180")}
          />
        </a>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-b border-neutral-normal-default px-5 py-6 bg-fill-neutral-subtle-default">
              <div className="inline-block">
                <Chip label={item.category} type="brandSubtleDefault" />
              </div>

              <div className="flex flex-col gap-[26px] text-body2-regular text-layout-body-default">
                <span className="block whitespace-pre-line">{item.answer}</span>
                {item.link && (
                  <Button
                    as={Link}
                    href={item.link.href}
                    variant="outlined"
                    className="!gap-[6px] bg-fill-neutral-normal-default"
                  >
                    {item.link.text}
                    <Icon name="ArrowRightSmall" size={18} />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

const SupportFaqAccordion = () => {
  const { tab } = useSupportTabQuery();
  const { expandedId, handleToggle } = useSupportFaqAccordion();
  const filteredItems = filterFaqItemsByTab(FAQ_ITEMS, tab);

  return (
    <ul>
      {filteredItems.map((item) => (
        <SupportFaqAccordionItem
          key={item.id}
          item={item}
          isExpanded={expandedId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </ul>
  );
};

export default SupportFaqAccordion;
