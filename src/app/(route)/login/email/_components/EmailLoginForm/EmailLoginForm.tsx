"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { EMAIL_LOGIN_CONFIG } from "../../_constants/EMAIL_LOGIN_CONFIG";
import useLoginForm from "../../_hooks/useLoginForm";
import { LoginFormType } from "../../_types/LoginFormType";
import { Button, CheckBox, InputText } from "@/components";
import { LogoLink } from "../../../_components";
import Link from "next/link";

const EmailLoginForm = () => {
  const { register, control } = useFormContext<LoginFormType>();
  const checkBoxValues = useWatch({ control, name: "rememberId" });

  const { onSubmitLogin, isPending } = useLoginForm();

  return (
    <form onSubmit={onSubmitLogin}>
      <main className="flex w-full gap-12 px-4 py-[64px] flex-col-center h-base tablet:px-[80px]">
        <div className="flex w-full flex-col gap-10">
          <LogoLink />

          {/* 로그인 입력칸 */}
          <fieldset className="flex w-full flex-col gap-3">
            <legend className="sr-only">로그인 정보 입력</legend>
            {EMAIL_LOGIN_CONFIG.map((item) => (
              <InputText key={item.inputOption.name} {...item} />
            ))}

            {/* 체크박스 */}
            <CheckBox
              {...register("rememberId", { required: false })}
              id="rememberId"
              label="아이디 기억하기"
              boxSize="size-[18px]"
              textStyle="text-caption1-semibold text-neutral-normal-default ml-2"
              iconSize="h-[6px]"
              checked={!!checkBoxValues}
            />
          </fieldset>
        </div>

        {/* 로그인 버튼 */}
        <footer className="w-full gap-5 flex-col-center tablet:px-[10px]">
          <Button type="submit" variant="auth" loading={isPending}>
            로그인
          </Button>

          {/* divider 구분선 */}
          <div className="flex h-4 w-full items-center">
            <hr className="h-px flex-1 border border-divider-default" aria-hidden={true} />
            <span className="px-3 text-caption1-medium text-layout-body-default">
              로그인이 되지 않는다면?
            </span>
            <hr className="h-px flex-1 border border-divider-default" aria-hidden={true} />
          </div>

          {/* 링크 이동 */}
          <nav className="flex h-11 w-full justify-center text-caption1-semibold">
            <div className="flex justify-end py-[6px]">
              <Link href="/find-pw" className="px-3 py-2 text-neutral-normal-default">
                비밀번호 찾기
              </Link>
            </div>

            <div className="flex px-[6px]">
              <hr className="h-4 w-px self-center bg-flatGray-50" />
            </div>

            <div className="flex justify-start py-[6px]">
              <Link href="/sign-up" className="px-3 py-2 text-brand-normal-default">
                회원가입
              </Link>
            </div>
          </nav>
        </footer>
      </main>
    </form>
  );
};

export default EmailLoginForm;
