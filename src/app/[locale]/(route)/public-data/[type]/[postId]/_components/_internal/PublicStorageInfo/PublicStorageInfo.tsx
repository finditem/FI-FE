import { useTranslations } from "next-intl";
import Image from "next/image";

interface PublicStorageInfoProps {
  office: string;
  department: string;
  tel: string;
  place: string;
  isLost: boolean;
}

const PublicStorageInfo = ({ office, department, tel, place, isLost }: PublicStorageInfoProps) => {
  const t = useTranslations("PublicStorageInfo");

  return (
    <section aria-labelledby="storage-info-title" className="space-y-[18px]">
      <h2 id="storage-info-title" className="text-h2-bold text-layout-header-default">
        {isLost ? t("lostInfoTitle") : t("storageInfoTitle")}
      </h2>

      <article className="flex flex-col gap-5 rounded-[24px] px-5 py-4 bg-fill-brand-subtle-default_2">
        <div className="flex items-center justify-between">
          <h3 className="text-body1-semibold text-layout-header-default">{office}</h3>
          <Image
            src="/public-data/public-detail-police24.webp"
            alt={t("policeMarkAlt")}
            width={100}
            height={21}
            unoptimized
          />
        </div>
        <ul
          aria-label={t("storagePlaceAriaLabel")}
          className="flex flex-col items-start text-body1-regular text-layout-header-default"
        >
          {department && (
            <li>
              {t("departmentLabel")}: {department} {tel}
            </li>
          )}
          <li>
            {isLost ? t("lostPlaceLabel") : t("foundPlaceLabel")}: {place}
          </li>
        </ul>
      </article>
    </section>
  );
};

export default PublicStorageInfo;
