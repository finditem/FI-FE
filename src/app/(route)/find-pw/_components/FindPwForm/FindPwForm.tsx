"use client";

import { useFormContext } from "react-hook-form";
import { Button, InputText } from "@/components/common";
import { cn } from "@/utils";
import Link from "next/link";
import { useFindPwSubmit } from "@/hooks/domain";
import { ApiFindPwType } from "@/api/fetch/auth";

const FindPwForm = () => {
  const { handleSubmit } = useFormContext<ApiFindPwType>();
  const { onSubmitFindPassword, email, isPending } = useFindPwSubmit();

  return (
    <form
      className={cn(
        "flex w-full flex-col gap-[10px] px-5 py-[64px] h-base tablet:px-20",
        email && "px-9"
      )}
      noValidate
      onSubmit={handleSubmit(onSubmitFindPassword)}
    >
      {!email ? (
        <div className="w-full tablet:px-4">
          <InputText
            label="아이디 (이메일)"
            inputOption={{
              name: "email",
              type: "email",
              placeholder: "아이디를 입력해 주세요.",
              maxLength: 254,
              validation: {
                required: "이메일을 입력해 주세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "이메일 형식을 입력해주세요.",
                },
              },
            }}
            btnOption={{
              btnLabel: "비밀번호 찾기",
              btnType: "submit",
              className: "min-w-[127px]",
              loading: isPending,
            }}
          />
        </div>
      ) : (
        <>
          <p className="flex flex-col items-center py-[18.5px] text-center text-body2-regular">
            <span className="flex items-center justify-center">
              <span className="inline-block max-w-[200px] truncate text-flatGreen-500">
                {email}
              </span>
              으로 <br />
            </span>
            임시 비밀번호를 발송했습니다.
          </p>
          <Button as={Link} href="/login/email" className="w-full" ariaLabel="로그인 화면으로 이동">
            비밀번호 변경
          </Button>
        </>
      )}
    </form>
  );
};

export default FindPwForm;
