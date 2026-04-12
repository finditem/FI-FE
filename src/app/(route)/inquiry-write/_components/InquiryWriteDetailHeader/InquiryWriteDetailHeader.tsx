import { DetailHeader } from "@/components/layout";
import { HeaderPost } from "@/components/layout/DetailHeader/DetailHeaderParts";

interface InquiryWriteDetailHeaderProps {
  isDisabled: boolean;
  onSubmit: () => void;
}

const InquiryWriteDetailHeader = ({ isDisabled, onSubmit }: InquiryWriteDetailHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 border-b border-labelsVibrant-quaternary bg-white">
      <DetailHeader title="무엇을 도와드릴까요?">
        <HeaderPost disabled={isDisabled} onClick={onSubmit} />
      </DetailHeader>
      <h1 className="sr-only">1:1 문의하기 작성</h1>
    </div>
  );
};

export default InquiryWriteDetailHeader;
