import { ReactNode } from "react";
import { DetailHeader } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-dvh w-full">
      <DetailHeader title="위치 등록" />
      <h1 className="sr-only">위치 등록 페이지</h1>

      {children}
    </div>
  );
};

export default layout;
