import plugin from "tailwindcss/plugin";
import type { CSSRuleObject } from "tailwindcss/types/config";

/**
 * flex-center
 */
export const flexCenter = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".flex-center": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
  addUtilities(utilities);
});

/**
 * flex-col-center
 */
export const flexColCenter = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".flex-col-center": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  };
  addUtilities(utilities);
});

/**
 * mouse-hover
 */
export const mouseHover = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".mouse-hover": {
      transitionProperty: "colors",
      transitionDuration: "100ms",
    },
  };
  addUtilities(utilities);
});

/**
 * u-ellipsis
 */
export const uEllipsis = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".u-ellipsis": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  };
  addUtilities(utilities);
});

/**
 * no-scrollbar: overflow-x-auto, whiteSpace-nowrap, scrollbar-hide
 */
export const noScrollbar = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".no-scrollbar": {
      overflowX: "auto",
      whiteSpace: "nowrap",

      "-ms-overflow-style": "none", // IE & Edge
      "scrollbar-width": "none", // Firefox

      "&::-webkit-scrollbar": {
        display: "none", // Chrome, Safari, Opera
      },
    },
  };

  addUtilities(utilities);
});

/**
 * h-base
 * @description h-base: Header만 있을 때
 * @description h-hf-base: Header + Footer 있을 때
 * @description h-f-base: Footer만 있을 때
 * @description h-hfb-base: Header + FooterButton 있을 때
 */
export const hBase = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".h-base": {
      minHeight: "calc(100dvh - 56px)",
    },
    ".h-hf-base": {
      minHeight: "calc(100dvh - 56px - 87px)",
    },
    ".h-f-base": {
      minHeight: "calc(100dvh - 87px)",
    },
    ".h-hfb-base": {
      minHeight: "calc(100dvh - 56px - 88px)",
    },
  };

  addUtilities(utilities);
});

/**
 * fixed-button-position
 * footer가 노출되는 페이지에서 사용됩니다.
 */
export const fixedButtonPosition = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".fixed-button-position": {
      bottom: "110px",
      right: "20px",
      position: "fixed",
    },
  };
  addUtilities(utilities);
});

/**
 * fixed-button-position-bottom
 * footer가 없는 페이지에서 사용됩니다.
 */
export const fixedButtonPositionBottom = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".fixed-button-position-bottom": {
      bottom: "24px",
      right: "20px",
      position: "fixed",
    },
  };
  addUtilities(utilities);
});

/**
 * footer-alert-dot
 */
export const footerAlertDot = plugin(function ({ addUtilities }) {
  const utilities: Record<string, CSSRuleObject> = {
    ".footer-alert-dot": {
      position: "absolute",
      backgroundColor: "#00B76E",
      width: "4px",
      height: "4px",
      borderRadius: "100%",
    },
  };
  addUtilities(utilities);
});
