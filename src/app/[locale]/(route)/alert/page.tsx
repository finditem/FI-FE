"use client";

import { Suspense, useState } from "react";
import { AlertCategory, AlertDetailHeader, AlertView } from "./_components";

const Alert = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  return (
    <>
      <Suspense fallback="">
        <AlertDetailHeader isDeleteMode={isDeleteMode} setIsDeleteMode={setIsDeleteMode} />
        <AlertCategory />
        <AlertView isDeleteMode={isDeleteMode} setIsDeleteMode={setIsDeleteMode} />
      </Suspense>
    </>
  );
};

export default Alert;
