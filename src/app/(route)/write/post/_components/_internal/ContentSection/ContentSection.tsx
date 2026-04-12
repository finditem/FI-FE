import { cn } from "@/utils";
import { RequiredText } from "@/components/common";
import { Controller, useFormContext } from "react-hook-form";
import { PostWriteFormValues } from "../../../_types/PostWriteType";

const ContentSection = () => {
  const { control } = useFormContext<PostWriteFormValues>();

  return (
    <section className="flex-1 border-b border-flatGray-50 px-5 py-6">
      <Controller
        control={control}
        name="content"
        rules={{
          required: "내용을 입력해주세요.",
          maxLength: {
            value: 500,
            message: "내용은 500자 이내로 입력해주세요.",
          },
        }}
        render={({ field }) => (
          <div className="relative">
            <textarea
              {...field}
              id="content"
              rows={5}
              maxLength={500}
              className={cn(
                "min-h-[200px] w-full resize-none py-1 text-body1-medium text-neutral-strong-default",
                "peer focus:outline-none"
              )}
            />

            {!field.value && (
              <div className={cn("pointer-events-none absolute left-0 top-1")}>
                <p className="text-body1-medium text-flatGray-400">
                  내용을 입력해 주세요. <RequiredText />
                </p>
                <p className="mt-7 text-body2-regular text-neutral-normal-placeholder">
                  분실/발견 날짜, 물건 종류, 물건의 특징 등 유실물 찾기에 도움이 되는 내용을 작성해
                  주세요. <br />
                  저작권과 관련된 내용은 반드시 출처를 표기해야 하며, 의심스러운 글을 작성할 경우
                  제재 조치를 받을 수 있습니다.
                </p>
              </div>
            )}
          </div>
        )}
      />
    </section>
  );
};

export default ContentSection;
