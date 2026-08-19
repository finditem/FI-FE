"use client";
"use no memo";

import { Fragment, useState } from "react";
import { FooterButton, CheckBox, InputField } from "@/components";
import { useFormContext } from "react-hook-form";
import DeleteAccountModal from "../DeleteAccountModal/DeleteAccountModal";
import { useTranslations } from "next-intl";
import { useDeleteAccountReasons } from "../../_hooks/useDeleteAccountReasons/useDeleteAccountReasons";

interface DeleteAccountReasonProps {
  onNext: () => void;
  socialUser?: boolean;
}

const DeleteAccountReason = ({ onNext, socialUser = false }: DeleteAccountReasonProps) => {
  const t = useTranslations("DeleteAccountReason");
  const reasonOptions = useDeleteAccountReasons();
  const {
    setValue,
    watch,
    register,
    formState: { isValid },
  } = useFormContext();

  const [modalOpen, setModalOpen] = useState(false);

  const selectedValues: string[] = watch("reasons") || [];

  const handleCheckboxChange = (value: string) => {
    let nextValues: string[];

    if (selectedValues.includes(value)) {
      nextValues = selectedValues.filter((item) => item !== value);
    } else {
      nextValues =
        selectedValues.length >= 3
          ? [...selectedValues.slice(1), value]
          : [...selectedValues, value];
    }

    setValue("reasons", nextValues, { shouldValidate: true, shouldDirty: true });
  };

  const handleSubmitStep = () => {
    if (socialUser) setModalOpen(true);
    else onNext();
  };

  return (
    <>
      <div className="flex w-full flex-col gap-7 px-5 py-[30px] h-hf-base tablet:px-20">
        <div className="flex flex-col gap-[6px]">
          <h3 className="text-h3-semibold">{t("title")}</h3>
          <p className="text-body2-regular text-layout-body-default">{t("selectionLimit")}</p>
        </div>
        <div className="flex flex-col gap-[18px]">
          {reasonOptions.map((item) => {
            const isChecked = selectedValues.includes(item.value);
            return (
              <Fragment key={item.label}>
                <CheckBox
                  {...register("reasons")}
                  id={item.value}
                  label={item.label}
                  value={item.value}
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(item.value)}
                />
                {isChecked && item.value === "OTHER" && (
                  <InputField
                    name="otherReason"
                    validation={{
                      maxLength: 300,
                      required: selectedValues.includes("OTHER") ? t("otherRequired") : false,
                    }}
                    placeholder={t("otherPlaceholder")}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <FooterButton onClick={handleSubmitStep} disabled={selectedValues.length === 0 || !isValid}>
        {socialUser ? t("deleteButton") : t("nextButton")}
      </FooterButton>

      {modalOpen && (
        <DeleteAccountModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onBack={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default DeleteAccountReason;
