"use client";
"use no memo";

import { FooterButton } from "@/components";
import { PasswordConfirmSection, VerifyPasswordSection } from "../_internal";
import { usePasswordSubmit } from "../../_hooks/usePasswordSubmit";

const ChangePasswordForm = () => {
  const { handlePasswordChange, buttonDisabled } = usePasswordSubmit();

  return (
    <form className="contents" onSubmit={handlePasswordChange}>
      <div className="flex flex-1 flex-col gap-5 px-5 py-[30px]">
        <VerifyPasswordSection />

        <PasswordConfirmSection />
      </div>

      <FooterButton type="submit" disabled={buttonDisabled}>
        변경 완료
      </FooterButton>
    </form>
  );
};

export default ChangePasswordForm;
