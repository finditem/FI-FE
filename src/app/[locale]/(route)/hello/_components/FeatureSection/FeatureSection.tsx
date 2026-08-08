import { ReactNode } from "react";
import { cn } from "@/utils";

interface FeatureSectionContent {
  title: string;
  description: ReactNode;
}

interface FeatureSectionProps {
  content: FeatureSectionContent;
  variant?: "default" | "highlight";
  imageSlot: ReactNode;
}

const FeatureSection = ({ content, variant = "default", imageSlot }: FeatureSectionProps) => {
  const { title, description } = content;

  return (
    <section
      aria-labelledby={`service-introduce-${title}`}
      className={cn(
        "w-full px-10 py-[60px] flex-col-center",
        variant === "highlight" && "bg-layoutBrand"
      )}
    >
      {imageSlot}
      <div className="mt-10 gap-5 text-center flex-col-center">
        <h2 className="text-h1-bold text-layout-header-default">{title}</h2>
        <p className="text-body1-regular text-layout-body-default">{description}</p>
      </div>
    </section>
  );
};

export default FeatureSection;
