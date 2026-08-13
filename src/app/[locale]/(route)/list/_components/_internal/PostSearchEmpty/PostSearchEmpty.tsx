import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button, EmptyState } from "@/components";

const sanitizeKeyword = (keyword: string) => keyword.replace(/[<>]/g, "").slice(0, 20);

const PostSearchEmpty = ({ keyword }: { keyword?: string }) => {
  const t = useTranslations("PostSearchEmpty");
  const displayKeyword = keyword ? sanitizeKeyword(keyword) : t("defaultKeyword");

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto">
      <EmptyState
        className="flex-1"
        icon={{
          iconName: "EmptyPostSearch",
          iconSize: 70,
        }}
        title={t("noResultsTitle")}
        description={t("noResultsDescription")}
      />

      <div className={keyword ? "visible" : "invisible"}>
        <div className="flex flex-col items-start gap-6">
          <p className="whitespace-pre-line px-5 text-h2-bold text-layout-header-default">
            {t.rich("searchPrompt", {
              keyword: displayKeyword,
              highlight: (chunks) => (
                <span className="text-brand-strongUseThis-default">{chunks}</span>
              ),
            })}
          </p>

          <div className="w-full border-t border-divider-default px-4 pb-8 pt-3">
            <Button as={Link} href="/public-data" className="w-full">
              {t("policeListButton")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSearchEmpty;
