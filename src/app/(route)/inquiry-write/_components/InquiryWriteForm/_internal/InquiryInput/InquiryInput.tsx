import { RequiredText, DeleteButton } from "@/components";
import { useHorizontalDragScroll } from "@/hooks";
import { cn } from "@/utils";
import { InputHTMLAttributes } from "react";
import { FieldValues, useFormContext, UseFormSetValue, useWatch } from "react-hook-form";
import { EMAIL_AUTO_COMPLETE_LIST } from "./EMAIL_AUTO_COMPLETE_LIST";

interface InquiryInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
}

const EmailAutoComplete = ({
  email,
  setValue,
}: {
  email: string;
  setValue: UseFormSetValue<FieldValues>;
}) => {
  const { ref: scrollRef, onMouseDown } = useHorizontalDragScroll();

  return (
    <div
      ref={scrollRef}
      onMouseDown={onMouseDown}
      className="hide-scrollbar flex w-full cursor-grab gap-1 overflow-x-auto overflow-y-hidden whitespace-nowrap pl-5 active:cursor-grabbing"
    >
      {EMAIL_AUTO_COMPLETE_LIST.map((item) => {
        const completedEmail = `${email}@${item}`;

        return (
          <button
            type="button"
            key={item}
            aria-label={`${item} 이메일 자동완성`}
            className="shrink-0 select-none rounded-full px-[6px] py-1 text-caption2-regular text-layout-header-default bg-fill-neutral-strong-default"
            onClick={() => setValue("email", completedEmail)}
          >
            {completedEmail}
          </button>
        );
      })}
    </div>
  );
};

const InquiryInput = ({ name, className, disabled, ...props }: InquiryInputProps) => {
  const { register, control, setValue } = useFormContext();
  const inputValue = useWatch({ control, name });
  const { placeholder, ...inputProps } = props;

  const isEmailField = name === "email";
  const emailValue = typeof inputValue === "string" ? inputValue : "";
  const hasInputValue = emailValue.length > 0;
  const shouldShowEmailAutoComplete =
    isEmailField && emailValue.length > 0 && !emailValue.includes("@");
  const shouldShowDeleteButton = hasInputValue && !disabled;

  return (
    <div>
      <div className={cn("px-5 py-2", shouldShowEmailAutoComplete && "mb-3 pb-0")}>
        <div className="relative">
          <input
            {...register(name)}
            className={cn(
              "border-transparent peer w-full rounded-full border px-4 py-3 text-body1-regular text-layout-header-default bg-fill-neutral-subtle-default placeholder:text-layout-body-default focus:border-brand-normal-default focus:outline-none disabled:text-layout-body-default disabled:bg-fill-neutral-subtle-pressed",
              hasInputValue && "pr-10",
              className
            )}
            disabled={disabled}
            placeholder={placeholder}
            {...inputProps}
          />
          {!inputValue && placeholder && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-4 flex items-center"
            >
              <span className="invisible text-body1-regular">{placeholder}</span>
              <RequiredText />
            </span>
          )}
          {shouldShowDeleteButton && (
            <DeleteButton
              eyeShow={false}
              className="right-4 top-1/2 -translate-y-1/2"
              value={emailValue}
              onDelete={() => setValue(name, "", { shouldDirty: true, shouldValidate: true })}
            />
          )}
        </div>
      </div>
      {shouldShowEmailAutoComplete && <EmailAutoComplete email={emailValue} setValue={setValue} />}
    </div>
  );
};

export default InquiryInput;
