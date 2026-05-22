"use client";
"use no memo";

import { Suspense } from "react";
import { ProfileEditSection } from "@/components";

const page = () => {
  return (
    <Suspense fallback={null}>
      <div className="h-base">
        <ProfileEditSection />
      </div>
    </Suspense>
  );
};

export default page;
