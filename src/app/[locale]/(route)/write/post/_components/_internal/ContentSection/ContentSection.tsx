import { cn } from "@/utils";
import { RequiredText } from "@/components";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { PostWriteFormValues } from "../../../_types/PostWriteType";

const ContentSection = () => {
  const t = useTranslations("ContentSection");
  const { control } = useFormContext<PostWriteFormValues>();

  return (
    <section className="flex-1 border-b border-flatGray-50 px-5 py-6">
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <div className="relative">
            <textarea
              {...field}
              id="content"
              aria-label={t("placeholder")}
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
                  {t("placeholder")} <RequiredText />
                </p>
                <p className="mt-7 text-body2-regular text-neutral-normal-placeholder">
                  {t("guideLine1")} <br />
                  {t("guideLine2")}
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
