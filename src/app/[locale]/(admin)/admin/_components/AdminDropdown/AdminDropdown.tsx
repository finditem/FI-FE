import { cn } from "@/utils";

interface DropdownOption {
  label: string;
  value: string;
}

interface AdminDropdownProps {
  open: boolean;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  className?: string;
  isPending?: boolean;
}

const AdminDropdown = ({ open, options, onSelect, className, isPending }: AdminDropdownProps) => {
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute top-full z-10 min-h-[150px] w-[123px] text-nowrap rounded-[20px] flex-col-center",
        "glass-card border bg-fill-neutral-subtle-default",
        className
      )}
    >
      <div className="flex flex-col divide-y divide-neutral-normal-default">
        {options.map((option) => (
          <button
            key={option.value}
            className={cn(
              "px-7 py-4 text-h3-medium text-neutral-normal-default",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
            onClick={() => onSelect(option.value)}
            disabled={isPending}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDropdown;
