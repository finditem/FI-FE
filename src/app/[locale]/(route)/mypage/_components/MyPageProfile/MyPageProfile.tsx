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

/**
 * 서버가 프로필 이미지로 URL/경로가 아닌 값(예: 숫자 0, 문자열 "0")을 내려줄 수 있어,
 * http(s) URL이나 절대 경로(`/`로 시작) 형태일 때만 유효한 이미지 값으로 인정한다.
 * 그 외에는 null을 반환해 ProfileAvatar가 기본 프로필 이미지로 대체하도록 한다.
 */
const resolveProfileImgSrc = (profileImg?: string): string | null => {
  if (typeof profileImg !== "string") return null;
  const trimmed = profileImg.trim();
  return /^(https?:\/\/|\/)/.test(trimmed) ? trimmed : null;
};

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
          src={resolveProfileImgSrc(profileImg)}
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
        // 로딩 스피너는 로그인된 사용자의 프로필 수정 버튼에만 의미가 있다.
        // 비로그인 상태에서는(무효한 토큰이 남아 /users/me가 재조회되는 경우 포함)
        // 로그인 버튼에 스피너가 깜빡이지 않도록 로그인 상태에서만 loading을 적용한다.
        loading={userData ? loading : false}
        onClick={userData ? undefined : () => trackClickLoginButton("mypage")}
      >
        {userData ? t("editProfile") : t("login")}
      </Button>
    </div>
  );
};

export default MyPageProfile;
