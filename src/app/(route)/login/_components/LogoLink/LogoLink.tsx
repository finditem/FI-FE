import Link from "next/link";
import { Icon } from "@/components";

const LogoLink = () => {
  return (
    <Link className="cursor-pointer gap-3 flex-center" href={"/"} aria-label="메인페이지 이동">
      <Icon name="Logo" size={40} title="로고" />
      <h2 className="text-h2-bold text-flatGreen-500">찾아줘!</h2>
    </Link>
  );
};

export default LogoLink;
