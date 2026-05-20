import { ReactNode } from "react";
import { ScrollToTopButton } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-dvh">
      {children}
      <ScrollToTopButton className="fixed-button-position-bottom" />
    </div>
  );
};

export default layout;
