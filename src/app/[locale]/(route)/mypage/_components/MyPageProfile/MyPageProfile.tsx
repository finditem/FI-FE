import Link from "next/link";
import { Button, ProfileAvatar } from "@/components";
import { trackClickLoginButton } from "@/utils/analytics/analytics";
import { useTranslations } from "next-intl";

interface ProfileProps {
  userData?: {
    nickname: string;
    email: string;
    profileImg?: string;
  };
  loading?: boolean;
}

const MyPageProfile = ({ userData, loading }: ProfileProps) => {
  const t = useTranslations("MyPageProfile");
  const { nickname, email, profileImg } = userData ?? {
    nickname: "",
    email: "",
    profileImg: "",
  };

  return (
    <div className="flex w-full items-center justify-between px-5 pb-[30px] pt-[calc(30px+var(--safe-area-top))]">
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
              {t("loginRequired")}
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
        onClick={userData ? undefined : () => trackClickLoginButton("mypage")}
      >
        {userData ? t("editProfile") : t("login")}
      </Button>
    </div>
  );
};

export default MyPageProfile;
