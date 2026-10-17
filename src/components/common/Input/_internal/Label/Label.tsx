import { RequiredText } from "@/components/common";
import { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  name: string;
  label?: ReactNode;
  required?: boolean;
}

const Label = ({ name, label, required, ...props }: LabelProps) => {
  return (
    <label htmlFor={name} {...props}>
      {label}
      {required && <RequiredText />}
    </label>
  );
};

export default Label;
