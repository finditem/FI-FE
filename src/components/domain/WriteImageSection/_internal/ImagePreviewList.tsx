"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import { cn } from "@/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

interface ImagePreviewListProps {
  images: { id: string; previewUrl: string }[];
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

interface ImageItemProps {
  image: { id: string; previewUrl: string };
  index: number;
  onRemove?: (index: number) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

const ImageItemUI = ({ image, index, onRemove, isDragging, isOverlay }: ImageItemProps) => {
  const t = useTranslations("WriteImageSection");

  return (
    <div
      className={cn(
        "relative shrink-0 touch-none",
        isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isDragging && !isOverlay ? "opacity-30" : "opacity-100"
      )}
    >
      <Image
        src={image.previewUrl}
        alt=""
        width={104}
        height={104}
        quality={100}
        draggable={false}
        className={cn(
          "pointer-events-none size-[104px] select-none rounded-[10px] object-cover",
          isOverlay && "scale-105 opacity-90 shadow-lg transition-transform"
        )}
      />
      {index === 0 && (
        <span
          className={cn(
            "absolute left-0 top-0 rounded-tl-[10px] pb-[3px] pl-[9px] pr-2 pt-[5px]",
            "pointer-events-none bg-flatGreen-500 text-caption1-semibold text-white"
          )}
        >
          {t("primaryBadge")}
        </span>
      )}
      {onRemove && !isOverlay && (
        <button
          type="button"
          aria-label={t("deleteAriaLabel")}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="absolute right-1.5 top-1.5 z-10 rounded-full border border-divider-default bg-[#5D5D5D] p-[5px]"
        >
          <Icon name="Delete" size={10} />
        </button>
      )}
    </div>
  );
};

interface SortableImageItemProps {
  id: string;
  index: number;
  image: { id: string; previewUrl: string };
  onRemove: (index: number) => void;
}

const SortableImageItem = ({ id, index, image, onRemove }: SortableImageItemProps) => {
  const t = useTranslations("WriteImageSection");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="shrink-0"
      aria-label={t("reorderAriaLabel", { number: index + 1 })}
      {...attributes}
      {...listeners}
    >
      <ImageItemUI image={image} index={index} onRemove={onRemove} isDragging={isDragging} />
    </div>
  );
};

const ImagePreviewList = ({ images, onRemove, onMove }: ImagePreviewListProps) => {
  const t = useTranslations("WriteImageSection");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onMove(oldIndex, newIndex);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeIndex = images.findIndex((img) => img.id === activeId);
  const activeImage = activeIndex !== -1 ? images[activeIndex] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext items={images.map((img) => img.id)} strategy={horizontalListSortingStrategy}>
        <div
          role="list"
          aria-label={t("previewListAriaLabel")}
          className="relative flex shrink-0 gap-2"
        >
          {images.map((image, index) => (
            <SortableImageItem
              key={image.id}
              id={image.id}
              index={index}
              image={image}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>

      {typeof document !== "undefined" && (
        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}
        >
          {activeImage ? <ImageItemUI image={activeImage} index={activeIndex} isOverlay /> : null}
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default ImagePreviewList;
