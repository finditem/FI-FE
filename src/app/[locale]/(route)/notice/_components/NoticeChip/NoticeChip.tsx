interface NoticeChipProps {
  label: "습득" | "분실" | "공지사항" | "문의내역";
}

const NoticeChip = ({ label }: NoticeChipProps) => (
  <div className="mb-[18px] mt-[24px] px-[18px] py-[6px]">
    <p className="text-[14px] font-semibold text-green-500">{label}</p>
  </div>
);

export default NoticeChip;
