"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PostWriteFormValues } from "../../../_types/PostWriteType";
import { useWriteFlowStore, useWriteStore } from "@/store";

const defaultValues: PostWriteFormValues = {
  postType: "",
  title: "",
  date: "",
  address: "",
  latitude: null,
  longitude: null,
  radius: null,
  category: "",
  content: "",
  images: [],
  temporarySave: false,
  postStatus: "",
  tempPostId: null,
};

const PostWriteFormProvider = ({ children }: { children: ReactNode }) => {
  const { fullAddress, lat: latitude, lng: longitude, radius } = useWriteStore();

  const methods = useForm<PostWriteFormValues>({
    defaultValues: {
      ...defaultValues,
      address: fullAddress || "",
      latitude,
      longitude,
      radius,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const resetWriteFlow = useWriteFlowStore((s) => s.resetWriteFlow);
  const clearLocation = useWriteStore((s) => s.clearLocation);
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const isNewWritePage = pathname === "/write/post";
    const isBackFromLocation = prevPathRef.current?.includes("/location");

    if (isNewWritePage && !isBackFromLocation) {
      clearLocation();
    }

    prevPathRef.current = pathname;

    return () => {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/write/post")) {
        resetWriteFlow();
      }
    };
  }, [clearLocation, pathname, resetWriteFlow]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default PostWriteFormProvider;
