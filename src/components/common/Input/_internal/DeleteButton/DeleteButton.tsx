import { ButtonHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import Icon from "@/components/common/Icon/Icon";

interface DeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  eyeShow?: boolean;
  value?: string;
  className?: string;
  onDelete?: () => void;
}

const DeleteButton = ({
  eyeShow,
  value = "",
  className,
  onDelete,
  ...props
}: DeleteButtonProps) => {
  const t = useTranslations("DeleteButton");
  const hasValue = !!value.trim();
  if (!hasValue) return null;

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={t("ariaLabel")}
      onClick={onDelete}
      className={cn(
        "absolute size-5 rounded-full bg-fg-neutral-strong-placeholder outline-none flex-center",
        eyeShow ? "right-8" : "right-2",
        className
      )}
      {...props}
    >
      <Icon name="Delete" size={6.97} />
    </button>
  );
};

export default DeleteButton;
