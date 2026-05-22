"use client";

import { Button, Icon, PopupLayout } from "@/components";
import Link from "next/link";

interface ManualPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualPopup = ({ isOpen, onClose }: ManualPopupProps) => {
  return (
    <PopupLayout isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto mb-6 mt-[71px] h-[74px] w-[74px] rounded-full">
        <Icon name="Book" size={74} />
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-h3-semibold text-[#171717]">
          분실물이 있나요? <br />
          매뉴얼을 보면 더 도움이 돼요!
        </h1>
        <p className="text-body2-medium text-[#7D7D7D]">
          분실물 발생 시 도움이 되는 정보를 <br /> 매뉴얼에서 확인해 보세요.
        </p>
      </div>

      <div className="my-10 flex flex-col gap-3">
        <Button
          className="h-[48px] w-full rounded-[12px] text-body1-semibold text-white bg-fill-brand-normal-default"
          as={Link}
          href="/manual"
        >
          매뉴얼 보러가기
        </Button>
        <Button
          variant="outlined"
          className="h-[64px] w-full border-none text-neutralInversed-strong-default"
          onClick={onClose}
        >
          다음에 볼게요
        </Button>
      </div>
    </PopupLayout>
  );
};

export default ManualPopup;
