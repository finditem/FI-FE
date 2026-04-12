import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";
import Link from "next/link";

interface ProfileEditLeaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditLeaveConfirmModal = ({ isOpen, onClose }: ProfileEditLeaveConfirmModalProps) => {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-[300px] gap-6 p-6 flex-col-center"
    >
      <div className="gap-1 flex-col-center">
        <h3 className="text-h3-semibold text-layout-header-default">
          변경사항이 저장되지 않았습니다.
        </h3>
        <p className="text-body2-regular text-layout-body-default">저장하지 않고 나가겠습니까?</p>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="w-full" onClick={onClose}>
          취소
        </Button>
        <Button className="w-full" as={Link} href="/mypage">
          나가기
        </Button>
      </div>
    </ModalLayout>
  );
};

export default ProfileEditLeaveConfirmModal;
