import { cn } from "@/utils";
import { RequiredText } from "@/components/common";
import { Controller, useFormContext } from "react-hook-form";
import { PostWriteFormValues } from "../../../_types/PostWriteType";

const TitleSection = () => {
  const { control } = useFormContext<PostWriteFormValues>();

  return (
    <section className="relative flex items-center justify-between border-b border-flatGray-50 px-5 py-6">
      <Controller
        control={control}
        name="title"
        rules={{
          required: "제목을 입력해 주세요.",
          maxLength: {
            value: 50,
            message: "제목은 50자 이내로 입력해 주세요.",
          },
        }}
        render={({ field }) => (
          <div className="relative w-full">
            <input
              {...field}
              type="text"
              id="title"
              maxLength={50}
              className="peer w-full bg-transparent text-body1-medium text-neutral-normal-default outline-none"
            />
            {!field.value && (
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2",
                  "pointer-events-none text-body1-medium text-neutral-normal-placeholder"
                )}
              >
                제목을 입력해 주세요. <RequiredText />
              </span>
            )}
          </div>
        )}
      />
    </section>
  );
};

export default TitleSection;
