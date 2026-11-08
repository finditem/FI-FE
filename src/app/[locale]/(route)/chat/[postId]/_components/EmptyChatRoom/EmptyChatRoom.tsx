import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import useEmptyModeStyle from "../../_hooks/useEmptyModeStyle/useEmptyModeStyle";

const EmptyChatRoom = ({ postMode }: { postMode: "find" | "lost" }) => {
  const t = useTranslations("EmptyChatRoom");
  const emptyModeStyle = useEmptyModeStyle();

  return (
    <section className="flex-1 bg-flatGray-25 flex-center">
      <h1 className="sr-only">{t("pageHeading")}</h1>
      <div className="gap-2 flex-col-center">
        <Icon name={emptyModeStyle[postMode].iconName} size={80} />
        <p className="select-none whitespace-pre-line text-center text-body2-medium text-layout-body-default">
          {emptyModeStyle[postMode].helpText}
        </p>
      </div>
    </section>
  );
};

export default EmptyChatRoom;
