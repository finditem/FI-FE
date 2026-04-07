"use no memo";

import { Icon, CheckBox } from "@/components/common";
import { DetailHeader } from "@/components/layout";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { FooterButton } from "@/components/domain";
import { TERMS_CONFIG } from "../_constants/TERMS_CONFIG";

interface AllAgreeProps {
  onOpenDetail: (termKey: string) => void;
  onComplete: () => void;
  isPending?: boolean;
}

const AllAgree = ({ onOpenDetail, onComplete, isPending }: AllAgreeProps) => {
  const {
    register,
    setValue,
    control,
    formState: { isValid },
  } = useFormContext();

  const selectAll = useWatch({ control, name: "selectAll" });
  const termsValue = useWatch({ control, name: TERMS_CONFIG.map((item) => item.name) });

  // 개별 체크박스와 전체 체크박스 동기화
  const allChecked =
    Array.isArray(termsValue) && termsValue.length === TERMS_CONFIG.length
      ? termsValue.every(Boolean)
      : false;

  useEffect(() => {
    if (selectAll !== allChecked) {
      setValue("selectAll", allChecked, { shouldValidate: false, shouldDirty: false });
    }
  }, [selectAll, allChecked, setValue]);

  // 전체약관동의 체크 박스 토글 함수
  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked; // 현재 체크 상태

    // 개별 항목 모두 체크
    TERMS_CONFIG.forEach((item) => {
      setValue(item.name, checked, { shouldValidate: true, shouldDirty: true });
    });
    setValue("selectAll", checked, { shouldValidate: false, shouldDirty: false }); // 전체 항목 체크
  };

  return (
    <>
      <DetailHeader title="회원가입" />
      <div className="flex w-full flex-col gap-7 p-4 h-hf-base">
        <p className="text-h3-semibold text-black">
          서비스 이용을 위해 <br />
          약관 동의가 필요합니다.
        </p>

        <div className="flex min-h-[272px] w-full flex-col gap-8">
          <div className="flex min-h-[68px] w-full items-center border-b border-divider-default text-body1-semibold text-neutral-normal-default">
            <CheckBox
              id="selectAll"
              label="전체 약관 동의"
              {...register("selectAll")}
              onChange={handleToggleAll}
              checked={!!selectAll}
            />
          </div>

          {/* 각 약관 동의 */}
          <div className="flex min-h-[172px] w-full flex-col gap-5">
            {TERMS_CONFIG.map((item, index) => (
              <div
                key={item.name}
                className="flex h-11 w-full items-center justify-between text-body1-semibold text-neutral-normal-default"
              >
                <CheckBox
                  id={item.name}
                  label={item.label}
                  {...register(item.name, item.validation)}
                  checked={!!termsValue?.[index]}
                />
                {item.name !== "over14Age" && (
                  <button
                    className="bg-white"
                    type="button"
                    aria-label="상세 약관 열기"
                    onClick={() => onOpenDetail(item.name)}
                  >
                    <Icon
                      name="ArrowRightSmall"
                      size={24}
                      className="text-neutral-normal-default"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterButton onClick={onComplete} disabled={!isValid || isPending}>
        가입 완료
      </FooterButton>
    </>
  );
};

export default AllAgree;
