import Link from "next/link";
import { Button } from "@/components/common";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";

/**
 * 비회원이 댓글 작성을 시도할 때 표시되는 로그인 유도 모달 컴포넌트입니다.
 *
 * @author jikwon
 */

interface GuestLoginModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}

/**
 * @example
 * ```tsx
 * <GuestLoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */

const GuestLoginModal = ({ isOpen, onClose }: GuestLoginModalProps) => {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} className="space-y-6 rounded-[8px] p-6">
      <div className="gap-1 text-center flex-col-center">
        <h2 className="text-h3-semibold text-layout-header-default">
          회원만 댓글을 작성할 수 있어요.
        </h2>
        <p className="text-body2-regular text-layout-body-default">로그인하고 의견을 남겨보세요.</p>
      </div>
      <div className="w-full gap-2 flex-center">
        <Button variant="outlined" className="min-h-11 w-[147px] flex-1" onClick={onClose}>
          취소
        </Button>
        <Button as={Link} href="/login" className="min-h-11 w-[147px] flex-1">
          로그인
        </Button>
      </div>
    </ModalLayout>
  );
};

export default GuestLoginModal;
