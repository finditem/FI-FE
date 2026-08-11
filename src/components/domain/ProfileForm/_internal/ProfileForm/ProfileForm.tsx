"use client";
"use no memo";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { UsersMeType } from "@/api/fetch/user/types/UserMeType";
import { Icon, InputText, KebabMenu, ProfileAvatar } from "@/components/common";
import { FooterButton } from "@/components/domain";
import { useNicknameCheck } from "@/hooks";
import { useProfileFormSubmit } from "../../_hooks/useProfileFormSubmit";
import { usePreventLeave } from "../../_hooks/usePreventLeave";
import { useChangeImg } from "../../_hooks/useChangeImg";
import MypageProfileModal from "../ProfileEditLeaveConfirmModal/ProfileEditLeaveConfirmModal";
import { useClickOutside } from "@/hooks";

interface ProfileFormProps {
  user?: UsersMeType;
  onConfirmRequest?: (submitFn: () => void) => void;
}

const ProfileForm = ({ user, onConfirmRequest }: ProfileFormProps) => {
  const t = useTranslations("ProfileForm");
  const { nickname, profileImg } = user ?? {};

  const [openModal, setOpenModal] = useState(false);
  const [openKebabMenu, setOpenKebabMenu] = useState(false);
  const { setValue, watch } = useFormContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const ref = useClickOutside(() => setOpenKebabMenu(false));

  // 닉네임 처리
  const { handleClickNickname, isNicknameVerified, isNicknameDisabled } = useNicknameCheck();

  // 이미지 처리
  const { handleChangeImg, handleButtonClick, previewImgUrl, handleDeleteImage, fileInputRef } =
    useChangeImg({
      setOpenKebabMenu,
      initialImg: profileImg,
      onImageChange: (file) => setValue("profileImg", file, { shouldDirty: true }),
    });

  // 최종 버튼 제출
  const { handleSubmitMypageProfile, isPending } = useProfileFormSubmit({
    preProfileImg: profileImg,
    onConfirmRequest: (submitFn) => {
      setIsSubmitting(true);
      if (onConfirmRequest) {
        onConfirmRequest(submitFn);
      } else {
        submitFn();
      }
    },
    isNicknameVerified,
  });

  const [profileImgValue, nicknameValue] = watch(["profileImg", "nickname"]);
  const isImageChanged = profileImgValue instanceof File || profileImgValue === null;

  const canSubmit = isImageChanged || isNicknameVerified;

  const hasChanges = (isImageChanged || nicknameValue) && !isSubmitting;
  usePreventLeave(hasChanges, () => setOpenModal(true));

  return (
    <form className="flex w-full flex-col h-base">
      <div className="flex-1">
        <div className="flex justify-center py-[30px]">
          <div ref={ref} className="relative z-10 h-[80px] w-[80px]">
            <ProfileAvatar size={80} src={previewImgUrl} alt={t("profileAlt")} priority={true} />
            <button
              className="absolute left-[52px] top-[52px] size-7 rounded-full bg-fill-neutral-strong-default flex-center"
              aria-label={t("changePhotoAriaLabel")}
              onClick={() => setOpenKebabMenu((prev) => !prev)}
              type="button"
            >
              <Icon name="CameraBorder" size={16} />
            </button>

            {/* 메뉴 */}
            {openKebabMenu && (
              <KebabMenu
                items={[
                  { text: t("chooseFromAlbum"), onClick: handleButtonClick, type: "button" },
                  {
                    text: t("deletePhoto"),
                    textColor: "text-system-warning",
                    onClick: handleDeleteImage,
                    type: "button",
                  },
                ]}
              />
            )}

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              ref={fileInputRef}
              onChange={handleChangeImg}
            />
          </div>
        </div>

        {/* 닉네임 input */}
        <div className="flex w-full flex-col gap-5 p-5">
          <InputText
            inputOption={{
              name: "nickname",
              disabled: isNicknameDisabled,
              placeholder: nickname,
              maxLength: 10,
              validation: {
                required: true,
                maxLength: 10,
                pattern: {
                  value: /^[^\s]+$/,
                  message: t("noSpacesError"),
                },
              },
              onKeyDown: (e) => {
                if (e.key === " ") e.preventDefault();
                if (e.key === "Enter") e.preventDefault();
              },
            }}
            label={t("nickname")}
            btnOption={{
              btnLabel: t("checkDuplicate"),
              onClick: () => {
                handleClickNickname("nickname");
              },
            }}
            caption={{
              rule: t("nicknameRule"),
              isSuccess: isNicknameVerified,
              successMessage: t("nicknameAvailable"),
            }}
          />
        </div>

        <MypageProfileModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      </div>

      <FooterButton
        type="button"
        disabled={!canSubmit || isPending}
        onClick={handleSubmitMypageProfile}
      >
        {t("submit")}
      </FooterButton>
    </form>
  );
};

export default ProfileForm;
