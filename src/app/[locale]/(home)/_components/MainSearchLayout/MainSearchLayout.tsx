import { ReactNode } from "react";
import { cn } from "@/utils";

interface MainSearchLayoutProps {
  focused: boolean;
  children: ReactNode;
}

const MainSearchLayout = ({ focused, children }: MainSearchLayoutProps) => {
  return (
    <div
      className={cn(
        "fixed top-0",
        focused
          ? "inset-x-0 bottom-0 z-[9999] mx-auto max-w-[768px] border-x-2 bg-white px-5 pb-3 pt-[calc(12px+var(--safe-area-top))]"
          : "bg-transparent left-1/2 z-10 w-full max-w-[768px] -translate-x-1/2 px-5 pb-[10px] pt-[calc(10px+var(--safe-area-top))]"
      )}
    >
      {children}
    </div>
  );
};

export default MainSearchLayout;
