import { Icon } from "@/components";
import Link from "next/link";

interface NoticeDetailHeaderProps {
  backPath: "/find" | "/lost" | "/notice?tab=notice" | "/notice?tab=customer";
}

const NoticeDetailHeader = ({ backPath }: NoticeDetailHeaderProps) => (
  <header className="flex items-center justify-between border-b border-[#E2E2E2] py-[15px] pl-[20px]">
    <Link href={backPath}>
      <Icon name="ArrowLeftSmall" size={30} className="text-neutral-strong-default" />
    </Link>
  </header>
);

export default NoticeDetailHeader;
