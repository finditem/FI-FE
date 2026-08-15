import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { PostWriteFormValues } from "../../_types/PostWriteType";
import usePostWriteSubmit from "../../_hooks/usePostWriteSubmit/usePostWriteSubmit";
import {
  Button,
  DetailHeader,
  ModalLayout,
  WriteImageSection,
  WriteActionSection,
} from "@/components";
import { CategorySection, ContentSection, LocationSection, TitleSection } from "../_internal";

const WriteForm = ({ title }: { title: string }) => {
  const t = useTranslations("WriteForm");
  const methods = useFormContext<PostWriteFormValues>();
  const values = methods.watch();
  const {
    onSubmit,
    isPosting,
    canSubmit,
    isConfirmModalOpen,
    onConfirmNoImageSubmit,
    onCancelSubmit,
  } = usePostWriteSubmit({ methods });

  const isSubmitDisabled = !canSubmit || isPosting;

  return (
    <>
      <DetailHeader title={title} />
      <h1 className="sr-only">{t("srOnlyPageTitle", { title })}</h1>
      <form onSubmit={onSubmit} className="flex flex-col h-base">
        <div className="flex min-h-0 flex-1 flex-col">
          <WriteImageSection />
          <CategorySection />
          <TitleSection />
          <ContentSection />
          <LocationSection />
        </div>
        <WriteActionSection disabled={isSubmitDisabled} />
      </form>

      {isConfirmModalOpen && (
        <ModalLayout isOpen={isConfirmModalOpen} onClose={onCancelSubmit} className="space-y-6 p-6">
          <div className="space-y-1 text-center">
            <h2 className="text-h3-semibold text-layout-header-default">
              {t("noImageConfirmTitle")}
            </h2>
            <p className="text-body2-regular text-layout-body-default">
              {t("noImageConfirmDescription")}
            </p>
          </div>
          <div className="w-full gap-2 flex-center">
            <Button variant="outlined" onClick={onCancelSubmit} className="min-h-11 flex-1">
              {t("cancelButton")}
            </Button>
            <Button onClick={onConfirmNoImageSubmit} className="min-h-11 flex-1">
              {t("confirmButton")}
            </Button>
          </div>
        </ModalLayout>
      )}
    </>
  );
};

export default WriteForm;
