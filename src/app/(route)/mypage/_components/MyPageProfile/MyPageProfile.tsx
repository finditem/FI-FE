import Link from "next/link";
import { Button, ProfileAvatar } from "@/components/common";

interface ProfileProps {
  userData?: {
    nickname: string;
    email: string;
    profileImg?: string;
  };
  loading?: boolean;
}

const MyPageProfile = ({ userData, loading }: ProfileProps) => {
  const { nickname, email, profileImg } = userData ?? {
    nickname: "",
    email: "",
    profileImg: "",
  };

  return (
    <div className="flex w-full items-center justify-between px-5 py-[30px]">
      <div className="flex w-[188px] items-center gap-6">
        <ProfileAvatar
          size={60}
          src={profileImg ? profileImg : null}
          alt={nickname}
          priority={true}
          className="flex-shrink-0"
        />
        <div className="flex w-[160px] flex-col gap-1">
          {userData ? (
            <>
              <span className="truncate text-body1-semibold">{nickname}</span>
              <span className="truncate text-body2-regular text-layout-body-default">{email}</span>
            </>
          ) : (
            <p className="text-nowrap text-body1-semibold text-layout-header-default">
              로그인 시 이용 가능합니다.
            </p>
          )}
        </div>
      </div>

      <Button
        as={Link}
        href={userData ? "/mypage/profile" : "/login"}
        variant="outlined"
        size="small"
        className="!min-w-[56px]"
        loading={loading}
      >
        {userData ? "프로필 수정" : "로그인"}
      </Button>
    </div>
  );
};

export default MyPageProfile;
