import { RequiredText } from "@/components/common";
import { useFormContext, useWatch } from "react-hook-form";
import { NoticeWriteFormValues } from "../../../_types/NoticeWriteType";

const TitleInput = () => {
  const { register, control } = useFormContext<NoticeWriteFormValues>();
  const titleValue = useWatch({ control, name: "title" });

  return (
    <section className="relative flex items-center border-y border-divider-default px-5 py-6">
      <input
        type="text"
        autoFocus
        placeholder="제목을 입력해 주세요."
        className="w-full pr-10 text-body1-medium text-neutral-normal-default placeholder:text-neutral-normal-placeholder"
        maxLength={50}
        {...register("title", {
          required: "제목을 입력해 주세요.",
          maxLength: {
            value: 50,
            message: "제목은 50자 이내로 입력해 주세요.",
          },
        })}
      />
      {!titleValue && <RequiredText className="absolute left-[156px]" />}
      <span className="absolute right-5 text-body2-regular text-neutral-normal-placeholder">
        {titleValue?.length || 0}/50
      </span>
    </section>
  );
};

export default TitleInput;
