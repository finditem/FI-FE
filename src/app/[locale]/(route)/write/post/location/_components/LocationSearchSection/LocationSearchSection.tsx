"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { InputSearch } from "@/components";
import { highlightText } from "@/utils";
import { useVWorldAddressSearch } from "@/hooks";

interface LocationSearchSectionProps {
  searchParams: URLSearchParams;
}

const LocationSearchSection = ({ searchParams }: LocationSearchSectionProps) => {
  const t = useTranslations("LocationSearchSection");
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      location: "",
    },
    mode: "onChange",
  });

  const locationValue = useWatch({
    control: methods.control,
    name: "location",
  });

  const { data: results = [], isLoading } = useVWorldAddressSearch(locationValue);

  const handleSelect = async (item: any) => {
    const address = item.address.road || item.address.parcel;
    methods.setValue("location", address);

    const params = new URLSearchParams(searchParams.toString());
    params.set("location", address);

    if (item.point) {
      params.set("lat", item.point.y);
      params.set("lng", item.point.x);
    }

    router.replace(`/write/post/location?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <section className="px-5 py-[10px]">
        <FormProvider {...methods}>
          <InputSearch placeholder={t("searchPlaceholder")} name="location" mode="RHF" autoFocus />
        </FormProvider>
      </section>

      <section aria-label={t("resultsSectionAriaLabel")} className="px-0">
        <p className="sr-only" aria-live="polite">
          {!locationValue?.trim()
            ? t("guideTitle")
            : isLoading
              ? t("srLoading")
              : t("srResultsCount", { count: results.length })}
        </p>

        <ul>
          {!locationValue?.trim() && <LocationGuideUI variant="initial" />}

          {results.map((item: any, index: number) => {
            const address = item.address.road || item.address.parcel;
            return (
              <li
                key={index}
                className="border-b border-neutral-normal-default transition-colors hover:bg-gray-100"
              >
                <button
                  type="button"
                  className="w-full p-5 text-left text-body2-medium text-neutral-strong-default"
                  onClick={() => handleSelect(item)}
                >
                  {highlightText(address, locationValue)}
                </button>
              </li>
            );
          })}

          {!isLoading && locationValue?.trim() && results.length === 0 && (
            <LocationGuideUI variant="empty" />
          )}
        </ul>
      </section>
    </>
  );
};

export default LocationSearchSection;

interface LocationGuideUIProps {
  variant: "initial" | "empty";
}

const LocationGuideUI = ({ variant }: LocationGuideUIProps) => {
  const t = useTranslations("LocationSearchSection");

  return (
    <li className="mt-[6px] px-5 py-[10px]">
      {variant === "empty" && (
        <p className="text-body1-semibold text-layout-header-default">{t("emptyResultsTitle")}</p>
      )}

      <p className="text-body1-semibold text-brand-normal-default">{t("guideTitle")}</p>
      <span className="text-body2-medium text-layout-body-default">{t("guideExample")}</span>
    </li>
  );
};
