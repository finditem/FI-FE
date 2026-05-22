import { Button, Icon } from "@/components";
import Link from "next/link";

const DeleteComplete = () => {
  return (
    <div className="w-full flex-col-center h-base">
      <div className="gap-4 flex-col-center">
        <Icon name="CompleteCheck" size={30} />

        <div className="gap-7 flex-col-center">
          <div className="gap-[10px] flex-col-center">
            <h2 className="text-h2-bold text-layout-header-default">회원 탈퇴가 완료되었습니다.</h2>
            <p className="text-body2-regular text-layout-body-default">
              동일한 이메일로 1주일간 재가입이 불가합니다.
            </p>
          </div>

          <Button as={Link} href="/" variant="outlined" replace className="!px-5">
            홈 화면으로 이동하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteComplete;
