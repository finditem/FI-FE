import { cn } from "@/utils";
import { RequiredText } from "@/components";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { PostWriteFormValues } from "../../../_types/PostWriteType";

const TitleSection = () => {
  const t = useTranslations("TitleSection");
  const { control } = useFormContext<PostWriteFormValues>();

  return (
    <section className="relative flex items-center justify-between border-b border-flatGray-50 px-5 py-6">
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <div className="relative w-full">
            <input
              {...field}
              type="text"
              aria-label={t("placeholder")}
              id="title"
              maxLength={50}
              className="bg-transparent peer w-full text-body1-medium text-neutral-normal-default outline-none"
            />
            {!field.value && (
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2",
                  "pointer-events-none text-body1-medium text-neutral-normal-placeholder"
                )}
              >
                {t("placeholder")} <RequiredText />
              </span>
            )}
          </div>
        )}
      />
    </section>
  );
};

export default TitleSection;
