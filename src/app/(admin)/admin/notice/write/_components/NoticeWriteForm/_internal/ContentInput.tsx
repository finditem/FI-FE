import { cn } from "@/utils";
import { RequiredText } from "@/components/common";
import { useFormContext, useWatch } from "react-hook-form";
import { NoticeWriteFormValues } from "../../../_types/NoticeWriteType";

const ContentInput = () => {
  const { register, control } = useFormContext<NoticeWriteFormValues>();
  const contentValue = useWatch({ control, name: "content" });

  return (
    <section className="relative min-h-[276px] flex-1 border-b border-flatGray-50 px-5 py-6">
      <textarea
        id="content"
        rows={5}
        placeholder="내용을 입력해 주세요."
        className={cn(
          "h-[208px] w-full resize-none py-1 text-body1-medium text-neutral-normal-default",
          "peer placeholder:text-neutral-normal-placeholder focus:outline-none"
        )}
        {...register("content", { required: true })}
        maxLength={500}
      />
      <span className="absolute bottom-6 right-5 text-body2-regular text-neutral-normal-placeholder">
        {contentValue?.length || 0}/500
      </span>
      {!contentValue && <RequiredText className="absolute left-[154px]" />}
    </section>
  );
};

export default ContentInput;
