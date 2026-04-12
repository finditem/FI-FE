"use client";

import { Button, Icon } from "@/components/common";
import { useAddToHomeScreen } from "@/hooks";
import PopupLayout from "../PopupLayout/PopupLayout";

interface AddToHomeScreenPWAProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddToHomeScreenPWA = ({ isOpen, onClose }: AddToHomeScreenPWAProps) => {
  const { installApp, canInstall } = useAddToHomeScreen();

  if (!canInstall) return null;

  const handleInstall = async () => {
    await installApp();
    onClose();
  };

  return (
    <PopupLayout isOpen={isOpen} onClose={onClose} className="mb-10 !bg-transparent px-5">
      <div className="gap-7 rounded-[24px] bg-white px-5 py-7 flex-col-center">
        <Icon name="Logo" size={60} />

        <div className="gap-3 text-center flex-col-center">
          <h2 className="text-h3-bold whitespace-pre-line text-layout-header-default">
            홈 화면에 찾아줘를 추가하고{"\n"}더 편리하게 사용하세요
          </h2>
          <p className="whitespace-pre-line text-body2-medium text-layout-body-default">
            홈 화면에 찾아줘 추가 시, 더 쉽고{"\n"}편리하게 서비스를 이용할 수 있어요
          </p>
        </div>

        <div className="w-full gap-3 flex-col-center">
          <Button className="min-h-11 w-full" onClick={handleInstall} disabled={!canInstall}>
            홈 화면에 추가하기
          </Button>
          <button
            className="min-h-9 w-full text-body2-semibold text-neutralInversed-strong-default"
            onClick={onClose}
          >
            다음에 할래요
          </button>
        </div>
      </div>
    </PopupLayout>
  );
};

export default AddToHomeScreenPWA;
