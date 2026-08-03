"use client";
"use no memo";

import DeleteAccountReason from "../DeleteAccountReason/DeleteAccountReason";
import DeleteAccountPassword from "../DeleteAccountPassword/DeleteAccountPassword";
import { useState } from "react";
import { useGetUsersMe } from "@/api/fetch/user";

const DeleteAccountContainer = () => {
  const { data: UserData } = useGetUsersMe();
  const { socialUser } = UserData?.result ?? {};

  const [state, setState] = useState<number>(1);

  const handleToNext = () => {
    setState(2);
  };

  return (
    <section>
      <h2 className="sr-only">탈퇴 선택 영역</h2>
      {state === 1 && <DeleteAccountReason onNext={handleToNext} socialUser={socialUser} />}

      {state === 2 && <DeleteAccountPassword onBack={() => setState(1)} />}
    </section>
  );
};

export default DeleteAccountContainer;
