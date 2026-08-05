import { DetailHeader } from "@/components";
import { NotificationSettingList } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="알림 설정" />

      <div className="w-full h-base">
        <h1 className="sr-only">알림 설정 페이지</h1>

        <NotificationSettingList />
      </div>
    </>
  );
};

export default page;
