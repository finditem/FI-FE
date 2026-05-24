import { Button, Icon, PopupLayout } from "@/components";

interface PublicCallBottomSheetData {
  location: string;
  phoneNumber: string;
}

interface PublicCallBottomSheetProps {
  callBottomSheetData: PublicCallBottomSheetData;
  isOpen: boolean;
  onClose: () => void;
}

const formattedPhone = (phoneNumber: string) => phoneNumber.replace(/[^0-9]/g, "");

const PublicCallBottomSheet = ({
  callBottomSheetData,
  isOpen,
  onClose,
}: PublicCallBottomSheetProps) => {
  const { location, phoneNumber } = callBottomSheetData;

  return (
    <PopupLayout isOpen={isOpen} onClose={onClose} className="!bg-transparent mb-10 px-5">
      <div className="gap-2 rounded-[24px] bg-white px-5 py-7 flex-col-center">
        <div className="flex w-full flex-col gap-7">
          <div className="space-y-[32px] text-center">
            <h2 className="text-h2-bold text-layout-header-default">보관 장소로 연결해드릴게요</h2>

            <div className="mx-auto flex min-h-[82px] min-w-[227px] max-w-full items-start justify-center gap-3 rounded-[16px] px-[18px] py-4 bg-fill-brand-subtle-default_2">
              <div className="size-10 shrink-0 rounded-[10px] bg-fill-brand-subtle-hover flex-center">
                <Icon name="Phone" size={20} />
              </div>
              <div className="flex flex-col gap-1 text-start">
                <h3 className="text-body1-semibold text-layout-header-default">{location}</h3>
                <p className="text-h2-bold text-brand-strongUseThis-default">{phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon
              name="MessageAlertCircle"
              size={20}
              className="size-9 rounded-[10px] p-[10px] bg-fill-neutral-strong-enteredSelected"
            />
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-body1-semibold text-layout-header-default">
                이렇게 물어보면 좋아요
              </h3>
              <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
                {`안녕하세요! 분실물을 찾고 있는데요,\n경찰청 습득물에 등록되어있는 글을 보고\n연락드렸어요.`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon
              name="MessageAlertCircle"
              size={20}
              className="size-9 rounded-[10px] p-[10px] bg-fill-neutral-strong-enteredSelected"
            />
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="text-body1-semibold text-layout-header-default">
                물건을 받으실 때는 본인 확인이 필요해요
              </h3>
              <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
                {`다음 신분증 중 하나를 꼭 지참해주세요\n주민등록증, 여권, 운전면허증, 청소년증 등`}
              </p>
            </div>
          </div>

          <Button as="a" href={`tel:${formattedPhone(phoneNumber)}`} className="min-h-11 w-full">
            전화하기
          </Button>
        </div>
      </div>
    </PopupLayout>
  );
};

export default PublicCallBottomSheet;
