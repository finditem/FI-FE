import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, ProfileAvatar } from "@/components";
import { cn, formatCappedNumber } from "@/utils";
import { ImageResponse, userInformation } from "@/api/fetch/post";
import { ImageSection } from "../_internal";

type HeaderData = {
  id: string;
  imageResponseList: ImageResponse[];
  userData: userInformation;
  isMine: boolean;
  /** `false`면 `isMine`이 확정되지 않은 상태라 채팅 버튼을 비활성화합니다. (default: true) */
  isPersonalized?: boolean;
};

interface PostDetailHeaderType {
  headerData: HeaderData;
}

const PostDetailHeader = ({ headerData }: PostDetailHeaderType) => {
  const t = useTranslations("PostDetailHeader");
  const { id, imageResponseList, userData, isMine, isPersonalized = true } = headerData;

  return (
    <>
      <ImageSection imageUrls={imageResponseList} />

      <section
        aria-label={t("authorInfoAriaLabel")}
        className={cn(
          "flex flex-col items-start justify-center gap-5 border-b border-divider-default p-5",
          "tablet:flex-row tablet:items-center tablet:justify-between"
        )}
      >
        <Link
          href={`/user/${userData.userId}`}
          aria-label={t("profileAriaLabel", { nickname: userData.nickName })}
          className={cn("flex items-center justify-start gap-[14px]", "tablet:w-[461px]")}
        >
          <ProfileAvatar
            size={40}
            src={userData.profileImage}
            alt={userData.nickName}
            priority={true}
          />

          <div className="flex flex-col items-start justify-center">
            <p className="text-body1-medium text-layout-header-default">{userData.nickName}</p>
            <div className="text-body2-regular text-layout-body-default">
              <span className="after:mx-2 after:inline-block after:content-['·']">
                {t("postCountLabel", { count: formatCappedNumber(userData.postCount) })}
              </span>
              <span>
                {t("chatCountLabel", { count: formatCappedNumber(userData.chattingCount) })}
              </span>
            </div>
          </div>
        </Link>

        {/* 내 글 여부가 확정되기 전에는 이동할 경로를 정할 수 없어 비활성 버튼으로 자리를 유지한다. */}
        {isPersonalized ? (
          <Button
            as={Link}
            href={isMine ? "/chat" : `/chat/${id}`}
            className={cn("min-h-11 w-full py-[10px]", "tablet:flex-1")}
            data-testid="post-chat-button"
          >
            {isMine ? t("goToChatList") : t("startChat")}
          </Button>
        ) : (
          <Button
            disabled
            className={cn("min-h-11 w-full py-[10px]", "tablet:flex-1")}
            data-testid="post-chat-button"
          >
            {t("startChat")}
          </Button>
        )}
      </section>
    </>
  );
};

export default PostDetailHeader;
