"use client";
"use no memo";

import DeleteAccountReason from "../DeleteAccountReason/DeleteAccountReason";
import DeleteAccountPassword from "../DeleteAccountPassword/DeleteAccountPassword";
import { useState } from "react";
import { useGetUsersMe } from "@/api/fetch/user";
import { useFormContext } from "react-hook-form";

const DeleteAccountContainer = () => {
  const { data: UserData } = useGetUsersMe();
  const { handleSubmit } = useFormContext();
  const { socialUser } = UserData?.result ?? {};

  const [state, setState] = useState<number>(1);

  const handleToNext = () => {
    if (socialUser) {
      handleSubmit((data) => {
        const formElement = document.querySelector("form");
        formElement?.requestSubmit();
      })();
    }
  };

  return (
    <section>
      <h2 className="sr-only">탈퇴 선택 영역</h2>
      {state === 1 && <DeleteAccountReason onNext={handleToNext} />}

      {state === 2 && <DeleteAccountPassword onBack={() => setState(1)} />}
    </section>
  );
};

export default DeleteAccountContainer;
