import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, PopupLayout } from "@/components";
import { cn } from "@/utils";
import { TEMPERATURE_CHARACTER } from "../../../../_constants/TEMPERATURE";

const TEMPERATURE_RULES = [
  { key: "foundPost", delta: 0.5 },
  { key: "returned", delta: 2 },
  { key: "review", delta: 1 },
  { key: "penalty", delta: -1 },
] as const;

interface TemperatureInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 찾길 온도가 어떻게 오르고 내리는지 설명하는 바텀시트입니다.
 *
 * @example
 * ```tsx
 * <TemperatureInfoSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */
const TemperatureInfoSheet = ({ isOpen, onClose }: TemperatureInfoSheetProps) => {
  const t = useTranslations("TemperatureInfoSheet");

  return (
    <PopupLayout
      isOpen={isOpen}
      onClose={onClose}
      draggable
      className="flex flex-col items-center gap-5 px-4 pb-6"
    >
      <Image src={TEMPERATURE_CHARACTER.rising} alt="" width={70} height={70} unoptimized />

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-h2-bold text-layout-header-default">{t("title")}</h2>
        <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
          {t("description")}
        </p>
      </div>

      <div className="w-full rounded-[16px] bg-layout_2depth px-4 pt-3">
        <table className="w-full">
          <thead>
            <tr>
              <th scope="col" className="text-left text-body2-medium text-layout-body-default">
                {t("columnItem")}
              </th>
              <th scope="col" className="text-right text-body2-medium text-layout-body-default">
                {t("columnValue")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider-default">
            {TEMPERATURE_RULES.map(({ key, delta }) => (
              <tr key={key}>
                <th scope="row" className="py-3 pr-3 text-left">
                  <span className="flex flex-col gap-1">
                    <span className="text-body2-semibold text-layout-header-default">
                      {t(`rules.${key}.title`)}
                    </span>
                    <span className="text-caption1-regular text-labelsVibrant-secondary">
                      {t(`rules.${key}.description`)}
                    </span>
                  </span>
                </th>
                <td
                  className={cn(
                    "whitespace-nowrap py-3 text-right text-body1-semibold",
                    delta > 0 ? "text-brand-strongUseThis-default" : "text-system-warning"
                  )}
                >
                  {delta > 0 && "+"}
                  {delta.toFixed(1)}℃
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="w-full break-keep text-caption2-regular text-layout-body-default">
        {t("note")}
      </p>

      <Button className="w-full" onClick={onClose}>
        {t("confirm")}
      </Button>
    </PopupLayout>
  );
};

export default TemperatureInfoSheet;
