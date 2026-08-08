import { ProfileAvatar } from "@/components";

interface UserHeaderProps {
  data?: {
    nickname: string;
    profileImg: string;
  };
}

const UserHeader = ({ data }: UserHeaderProps) => {
  const { nickname, profileImg } = data || {};

  return (
    <section className="flex items-center gap-6 p-5">
      <ProfileAvatar src={profileImg} alt={nickname} size={60} />

      <div className="flex flex-col items-start gap-1">
        <h2 className="text-body1-semibold text-layout-header-default">
          {nickname || "로딩 중..."}
        </h2>
      </div>
    </section>
  );
};

export default UserHeader;
