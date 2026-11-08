"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LocationRangeSection, LocationSearchSection } from "./_components";

const LocationPage = () => {
  const searchParams = useSearchParams();

  const locationTitle = searchParams.get("location");
  const locationName = locationTitle?.trim().split(/\s+/).at(-1) ?? null;
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  const initialLat = latParam ? Number(latParam) : undefined;
  const initialLng = lngParam ? Number(lngParam) : undefined;

  return (
    <>
      {!locationTitle ? (
        <LocationSearchSection searchParams={searchParams} />
      ) : (
        <LocationRangeSection
          address={locationName}
          fullAddress={locationTitle}
          initialLat={initialLat}
          initialLng={initialLng}
        />
      )}
    </>
  );
};

const Page = () => (
  <Suspense fallback={null}>
    <LocationPage />
  </Suspense>
);

export default Page;
