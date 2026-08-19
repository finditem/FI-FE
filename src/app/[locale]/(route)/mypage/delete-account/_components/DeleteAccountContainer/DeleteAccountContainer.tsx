"use client";
"use no memo";

import DeleteAccountReason from "../DeleteAccountReason/DeleteAccountReason";
import DeleteAccountPassword from "../DeleteAccountPassword/DeleteAccountPassword";
import { useState } from "react";
import { useGetUsersMe } from "@/api/fetch/user";
import { useTranslations } from "next-intl";

const DeleteAccountContainer = () => {
  const t = useTranslations("DeleteAccountContainer");
  const { data: UserData } = useGetUsersMe();
  const { socialUser } = UserData?.result ?? {};

  const [state, setState] = useState<number>(1);

  const handleToNext = () => {
    setState(2);
  };

  return (
    <section>
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>
      {state === 1 && <DeleteAccountReason onNext={handleToNext} socialUser={socialUser} />}

      {state === 2 && <DeleteAccountPassword onBack={() => setState(1)} />}
    </section>
  );
};

export default DeleteAccountContainer;
