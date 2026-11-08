import { useTranslations } from "next-intl";
import { buildErrorMap } from "@/utils";
import { SIGNUP_ERROR_STATUS } from "../../_constants/SIGNUP_ERROR_MESSAGE";

export const useSignUpErrorMessage = () => {
  const t = useTranslations("SignUpErrorMessage");
  return buildErrorMap(SIGNUP_ERROR_STATUS, t);
};
