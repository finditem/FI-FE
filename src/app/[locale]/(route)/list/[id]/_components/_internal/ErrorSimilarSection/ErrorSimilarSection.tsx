import { useTranslations } from "next-intl";
import { Button, Icon } from "@/components";
import { useQueryClient } from "@tanstack/react-query";

const ErrorSimilarSection = ({ postId, title }: { postId: number; title?: string }) => {
  const t = useTranslations("ErrorSimilarSection");
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["similar", postId] });
  };

  return (
    <>
      <hr className="w-full border-neutral-normal-default" />
      <div className="flex flex-col gap-3 py-[18px]">
        <h2 className="pl-5 text-h2-medium text-flatGray-900">{title ?? t("defaultTitle")}</h2>

        <div className="space-y-[18px] py-[10px] flex-col-center">
          <Icon name="ErrorSimilarSection" size={38} />
          <div className="space-y-7 flex-col-center">
            <div className="space-y-2 text-center">
              <p className="text-h2-bold text-layout-header-default">{t("loadFailedTitle")}</p>
              <span className="block text-body2-regular text-layout-body-default">
                {t("loadFailedDescription")}
              </span>
            </div>
            <Button variant="outlined" className="px-3" onClick={handleRefresh}>
              {t("refresh")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorSimilarSection;
