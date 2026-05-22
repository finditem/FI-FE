import type { Metadata } from "next";
import { ErrorView } from "@/components";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
  description:
    "요청하신 페이지를 찾을 수 없습니다. 주소가 잘못되었거나 삭제된 페이지일 수 있습니다. 찾아줘 메인 페이지에서 다시 확인해 주세요.",
};

const NotFound = () => {
  return (
    <ErrorView
      iconName="NotFound"
      code="404"
      title="페이지를 찾을 수 없습니다."
      description={
        <>
          존재하지 않는 주소를 입력했거나 <br />
          요청하신 페이지를 사용할 수 없습니다.
        </>
      }
    />
  );
};

export default NotFound;
