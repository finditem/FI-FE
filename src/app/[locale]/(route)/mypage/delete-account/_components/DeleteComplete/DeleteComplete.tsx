import { Button, Icon } from "@/components";
import Link from "next/link";
import { useTranslations } from "next-intl";

const DeleteComplete = () => {
  const t = useTranslations("DeleteComplete");
  return (
    <div className="w-full flex-col-center h-base">
      <div className="gap-4 flex-col-center">
        <Icon name="CompleteCheck" size={30} />

        <div className="gap-7 flex-col-center">
          <div className="gap-[10px] flex-col-center">
            <h2 className="text-h2-bold text-layout-header-default">{t("title")}</h2>
            <p className="text-body2-regular text-layout-body-default">{t("description")}</p>
          </div>

          <Button as={Link} href="/" variant="outlined" replace className="!px-5">
            {t("homeButton")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteComplete;
