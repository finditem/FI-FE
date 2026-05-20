import { ReactNode } from "react";
import { DetailHeader } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DetailHeader title="내가 차단한 계정" />
      <h1 className="sr-only">내가 차단한 계정</h1>

      {children}
    </>
  );
};

export default layout;
