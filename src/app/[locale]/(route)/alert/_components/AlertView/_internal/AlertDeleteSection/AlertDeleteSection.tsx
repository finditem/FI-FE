import { useTranslations } from "next-intl";
import { DeleteTarget } from "@/app/[locale]/(route)/alert/_types/DeleteTargetType";
import { Button } from "@/components";

interface AlertDeleteSectionProps {
  isDeleteMode: boolean;
  disabled: boolean;
  setIsDeleteModalOpen: (isDeleteModalOpen: boolean) => void;
  setDeleteTarget: (deleteTarget: DeleteTarget) => void;
}

const AlertDeleteSection = ({
  isDeleteMode,
  disabled,
  setIsDeleteModalOpen,
  setDeleteTarget,
}: AlertDeleteSectionProps) => {
  const t = useTranslations("AlertDeleteSection");
  const handleDeleteAll = () => {
    setDeleteTarget("all");
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      {isDeleteMode && <div aria-hidden className="h-[86px]" />}
      {isDeleteMode && (
        <div className="fixed bottom-[86px] left-0 right-0 mx-auto flex max-w-[768px] gap-2 border-x-2 border-t border-t-divider-default bg-white px-4 pb-8 pt-3">
          <Button
            size="big"
            variant="outlined"
            className="w-[116px] text-system-warning"
            onClick={handleDeleteAll}
          >
            {t("deleteAllLabel")}
          </Button>
          <Button
            size="big"
            disabled={disabled}
            className="flex-1"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            {t("deleteSelectedLabel")}
          </Button>
        </div>
      )}
    </>
  );
};

export default AlertDeleteSection;
