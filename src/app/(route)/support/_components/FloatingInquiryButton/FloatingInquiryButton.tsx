import Link from "next/link";

const FloatingInquiryButton = () => {
  return (
    <div className="fixed bottom-5 right-5">
      <Link
        href="/inquiry-write"
        className="rounded-2xl px-[34px] py-4 text-body1-semibold text-white bg-fill-brand-normal-default flex-center"
      >
        1:1 문의하기
      </Link>
    </div>
  );
};

export default FloatingInquiryButton;
