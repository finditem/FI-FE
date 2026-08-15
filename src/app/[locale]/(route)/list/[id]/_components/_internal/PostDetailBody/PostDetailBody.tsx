import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components";
import { PostDetailData } from "@/api/fetch/post";
import { formatDate, formatViewCount } from "@/utils";
import PostChipSection from "../PostChipSection/PostChipSection";
import { useToggleFavorite } from "../../../_hooks/useToggleFavorite/useToggleFavorite";

interface PostDetailBodyProps {
  data: PostDetailData;
}

const PostDetailBody = ({ data }: PostDetailBodyProps) => {
  const t = useTranslations("PostDetailBody");
  const locale = useLocale();
  const { title, content, favoriteCount, postStatus, category, createdAt, viewCount } = data;
  const { handleToggleFavorite, isPending } = useToggleFavorite({ postId: data.id });
  const isKo = locale === "ko";

  return (
    <article>
      <PostChipSection chipData={{ postStatus, category }} />

      <div className="mt-[14px]">
        <div>
          <h1 className="text-[20px] font-semibold text-layout-header-default">{title}</h1>
          <time className="text-[14px] leading-[140%] text-layout-body-default">
            {formatDate(createdAt)}
          </time>
        </div>

        <p className="mt-6 text-body1-regular text-layout-header-default">{content}</p>

        <ul className="mt-8 flex gap-5 text-body2-medium text-layout-body-default">
          <li className="flex items-center gap-1">
            <Icon name="EyeDetail" size={20} className="text-border-divider-default" />
            <span>
              {isKo
                ? t("viewCountLabel", { count: formatViewCount(viewCount) })
                : t("viewCountLabel", { count: viewCount })}
            </span>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center gap-1"
              disabled={isPending}
              onClick={() => handleToggleFavorite(data.favoriteStatus)}
            >
              <Icon
                name="Star"
                size={20}
                className={
                  data.favoriteStatus ? "text-system-bookmark" : "text-border-divider-default"
                }
              />
              {isKo ? (
                <>
                  <span>{t("favoriteLabel")}</span>
                  <span>{formatViewCount(favoriteCount)}</span>
                </>
              ) : (
                <span>{t("favoriteCountLabel", { count: favoriteCount })}</span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </article>
  );
};

export default PostDetailBody;
