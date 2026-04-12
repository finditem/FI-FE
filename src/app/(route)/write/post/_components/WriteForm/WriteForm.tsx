import { useFormContext } from "react-hook-form";
import { PostWriteFormValues } from "../../_types/PostWriteType";
import usePostWriteSubmit from "../../_hooks/usePostWriteSubmit/usePostWriteSubmit";
import { Button } from "@/components/common";
import { DetailHeader } from "@/components/layout";
import ModalLayout from "@/components/common/Modal/_internal/ModalLayout";
import { CategorySection, ContentSection, LocationSection, TitleSection } from "../_internal";
import { WriteImageSection, WriteActionSection } from "@/components/domain";

const WriteForm = ({ title }: { title: string }) => {
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
      <h1 className="sr-only">{`${title} 페이지`}</h1>
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
              사진을 첨부하지 않고 등록하시겠습니까?
            </h2>
            <p className="text-body2-regular text-layout-body-default">
              사진을 첨부하시면 유실물을 더 잘 찾아드릴 수 있어요.
            </p>
          </div>
          <div className="w-full gap-2 flex-center">
            <Button variant="outlined" onClick={onCancelSubmit} className="min-h-11 flex-1">
              아니요
            </Button>
            <Button onClick={onConfirmNoImageSubmit} className="min-h-11 flex-1">
              이미지 없이 등록
            </Button>
          </div>
        </ModalLayout>
      )}
    </>
  );
};

export default WriteForm;
