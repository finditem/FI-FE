import Button from "@/components/common/Buttons/Button/Button";
import { ButtonHTMLAttributes } from "react";

/**
 * footer에서 사용되는 버튼 컴포넌트입니다.
 *
 * @author suhyeon
 */

interface FooterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 텍스트를 의미합니다. */
  children: string;
  /** 버튼의 모든 옵션들을 사용할 수 있습니다. */
  type?: "button" | "submit" | "reset";
}

/**
 * @example
 * ```tsx
 * <FooterButton>
 * 완료
 * </FooterButton>
 * ```
 */

const FooterButton = ({ children, type = "button", ...props }: FooterButtonProps) => {
  return (
    <footer className="sticky bottom-0 h-[88px] w-full border-t border-divider-default bg-white px-4 pb-8 pt-3">
      <Button type={type} variant="auth" {...props}>
        {children}
      </Button>
    </footer>
  );
};

export default FooterButton;
