/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      labelsVibrant: {
        secondary: "#999999",
        primary: "#333333",
        quaternary: "#d9d9d9",
        tertiary: "#bfbfbf"
      },
      accents: {
        red: "#ff383c"
      },
      mode: "Light",
      color: {
        cyan: {
          0: "#ffffff",
          50: "#f7feff",
          100: "#defaff",
          200: "#b5f4ff",
          300: "#8aedff",
          400: "#57dff7",
          500: "#28d0ed",
          600: "#00bdde",
          700: "#0098b2",
          800: "#006f82",
          900: "#004854",
          950: "#00252b",
          1000: "#000000"
        },
        lime: {
          0: "#ffffff",
          50: "#f8fff2",
          100: "#e6ffd4",
          200: "#ccfca9",
          300: "#aef779",
          400: "#88f03e",
          500: "#6be016",
          600: "#58cf04",
          700: "#48ad00",
          800: "#347d00",
          900: "#225200",
          950: "#112900",
          1000: "#000000"
        },
        flatGray: {
          0: "#ffffff",
          25: "#f5f5f5",
          50: "#e4e4e4",
          100: "#d9d9d9",
          200: "#cfcfcf",
          300: "#adadad",
          400: "#9d9d9d",
          500: "#787878",
          600: "#5d5d5d",
          700: "#525252",
          800: "#363636",
          900: "#242424",
          950: "#131416",
          1000: "#000000"
        },
        orange: {
          0: "#ffffff",
          50: "#fffcf7",
          100: "#fef4e6",
          200: "#fee6c6",
          300: "#ffd49c",
          400: "#ffc642",
          500: "#ff9200",
          600: "#d47800",
          700: "#d17600",
          800: "#9c5800",
          900: "#663a00",
          950: "#361e00",
          1000: "#000000"
        },
        red: {
          0: "#ffffff",
          50: "#fffafa",
          100: "#feecec",
          200: "#fed5d5",
          300: "#ffb5b5",
          400: "#ff8c8c",
          500: "#ff6363",
          600: "#ff4242",
          700: "#e52222",
          800: "#b00c0c",
          900: "#730303",
          950: "#3b0101",
          1000: "#000000"
        },
        blue: {
          0: "#ffffff",
          12: "#f7fbff",
          25: "#eaf2fe",
          50: "#cde1fe",
          75: "#b8d4ff",
          100: "#69a5ff",
          200: "#4f95ff",
          300: "#3385ff",
          400: "#1a75ff",
          500: "#0066ff",
          600: "#005eeb",
          700: "#0054d1",
          800: "#003e9c",
          900: "#002966",
          950: "#001536",
          1000: "#000000"
        },
        pink: {
          0: "#ffffff",
          50: "#fffafe",
          100: "#feecfb",
          200: "#fed3f7",
          300: "#ffb8f3",
          400: "#ff94ed",
          500: "#fa73e3",
          600: "#f553da",
          700: "#d331b8",
          800: "#a81690",
          900: "#730560",
          950: "#3d0133",
          1000: "#000000"
        },
        flatGreen: {
          0: "#f6fffc",
          12: "#f7fffa",
          25: "#eefff6",
          50: "#e3fcee",
          75: "#d6f8e1",
          100: "#c2f1d4",
          200: "#98e3bd",
          300: "#6ed5a7",
          400: "#46c691",
          500: "#0aa874",
          600: "#00b76e",
          700: "#009e53",
          800: "#00753e",
          900: "#004c29",
          950: "#002817",
          1000: "#00110a"
        },
        violet: {
          0: "#ffffff",
          50: "#fbfaff",
          100: "#f0ecfe",
          200: "#dbd3fe",
          300: "#c0b0ff",
          400: "#9e86fc",
          500: "#7d5ef7",
          600: "#6541f2",
          700: "#4f29e5",
          800: "#3a16c9",
          900: "#23098f",
          950: "#11024d",
          1000: "#000000"
        },
        navy: {
          400: "#42547e",
          500: "#293b62",
          600: "#152343"
        },
        glassGreen: {
          0: "rgba(246, 255, 252, 0.9)",
          12: "rgba(247, 255, 250, 0.9)",
          25: "rgba(238, 255, 246, 0.9)",
          50: "rgba(227, 252, 238, 0.9)",
          75: "rgba(214, 248, 225, 0.9)",
          100: "rgba(194, 241, 212, 0.9)",
          200: "rgba(152, 227, 189, 0.9)",
          300: "rgba(110, 213, 167, 0.9)",
          400: "rgba(70, 198, 145, 0.7)",
          500: "rgba(30, 184, 123, 0.7)",
          600: "rgba(0, 183, 110, 0.7)",
          700: "rgba(0, 158, 83, 0.7)",
          800: "rgba(0, 117, 62, 0.7)",
          900: "rgba(0, 76, 41, 0.7)",
          950: "rgba(0, 40, 23, 0.7)",
          1000: "rgba(0, 17, 10, 0.7)"
        },
        glassGray: {
          0: "rgba(255, 255, 255, 0.7)",
          25: "rgba(245, 245, 245, 0.7)",
          50: "rgba(228, 228, 228, 0.7)",
          100: "rgba(217, 217, 217, 0.7)",
          200: "rgba(207, 207, 207, 0.7)",
          300: "rgba(173, 173, 173, 0.7)",
          400: "rgba(157, 157, 157, 0.7)",
          500: "rgba(120, 120, 120, 0.7)",
          600: "rgba(93, 93, 93, 0.7)",
          700: "rgba(82, 82, 82, 0.7)",
          800: "rgba(54, 54, 54, 0.7)",
          900: "rgba(36, 36, 36, 0.7)",
          950: "rgba(19, 20, 22, 0.7)",
          1000: "rgba(0, 0, 0, 0.7)"
        },
        yellow: {
          500: "#fee500"
        },
        tansparnt: {
      "white_4": "rgba(255, 255, 255, 0.04)",
      "white_8": "rgba(255, 255, 255, 0.08)",
      "white_12": "rgba(255, 255, 255, 0.12)"
        },
        transparent: {
      "white_4": "rgba(255, 255, 255, 0.04)",
      "white_8": "rgba(255, 255, 255, 0.08)",
      "white_12": "rgba(255, 255, 255, 0.12)"
        },
        gray: {
          0: "#ffffff"
        },
        green: {
          500: "#0aa874"
        }
      },
      value: {
        50: 2,
        100: 4,
        150: 6,
        200: 8,
        250: 10,
        300: 12,
        350: 14,
        400: 16,
        450: 18,
        500: 20,
        550: 22,
        600: 24,
        650: 26,
        700: 28,
        750: 30,
        800: 32,
        900: 36,
        1000: 40,
        1200: 48,
        1400: 56,
        1600: 64,
        1800: 72,
        2000: 80,
        2400: 96,
        2500: 100,
        3000: 120,
        4000: 160,
        6000: 240,
        8000: 320
      },
      baseColor: "#ffffff",
      fill: {
        neutral: {
          strong: {
            focused: "#f5f5f5",
            hover: "#f5f5f5",
            pressed: "#e4e4e4",
            default: "#f5f5f5",
            enteredSelected: "#f5f5f5",
            disabled: "#e4e4e4",
        "disabled_2": "#e4e4e4",
        "pressed_2": "#e4e4e4",
        "focused_2": "#f5f5f5",
        "default_2": "#f5f5f5",
        "enteredSelected_2": "#f5f5f5",
        "hover_2": "#f5f5f5"
          },
          normal: {
            default: "#ffffff",
            focused: "#ffffff",
            pressed: "#f5f5f5",
            hover: "#ffffff",
            enteredSelected: "#ffffff",
            disabled: "#e4e4e4",
        "pressed_2": "#f5f5f5",
        "disabled_2": "#e4e4e4",
        "focused_2": "#ffffff",
        "enteredSelected_2": "#ffffff",
        "hover_2": "#ffffff",
        "default_2": "#ffffff"
          },
          subtle: {
            default: "rgba(245, 245, 245, 0.7)",
            hover: "rgba(245, 245, 245, 0.7)",
            focused: "rgba(245, 245, 245, 0.7)",
            enteredSelected: "#f5f5f5",
            pressed: "#e4e4e4",
            disabled: "rgba(228, 228, 228, 0.7)",
        "pressed_2": "#e4e4e4",
        "disabled_2": "rgba(228, 228, 228, 0.7)",
        "focused_2": "rgba(245, 245, 245, 0.7)",
        "enteredSelected_2": "#f5f5f5",
        "hover_2": "rgba(245, 245, 245, 0.7)",
        "default_2": "rgba(245, 245, 245, 0.7)"
          }
        },
        brand: {
          subtle: {
            enteredSelected: "#e3fcee",
            focused: "#c2f1d4",
            hover: "#c2f1d4",
            default: "#d6f8e1",
            disabled: "#e3fcee",
            pressed: "#c2f1d4",
        "focused_2": "#c2f1d4",
        "hover_2": "#c2f1d4",
        "default_2": "#eefff6",
        "enteredSelected_2": "#e3fcee",
        "pressed_2": "#c2f1d4",
        "disabled_2": "#e3fcee",
        "default_3": "#eefff6"
          },
          normal: {
            pressed: "rgba(0, 158, 83, 0.7)",
            hover: "rgba(0, 183, 110, 0.7)",
            default: "rgba(30, 184, 123, 0.7)",
            enteredSelected: "rgba(70, 198, 145, 0.7)",
            focused: "rgba(0, 183, 110, 0.7)",
            disabled: "rgba(152, 227, 189, 0.9)",
        "enteredSelected_2": "rgba(70, 198, 145, 0.7)",
        "disabled_2": "rgba(152, 227, 189, 0.9)",
        "default_2": "rgba(30, 184, 123, 0.7)",
        "focused_2": "rgba(0, 183, 110, 0.7)",
        "hover_2": "rgba(0, 183, 110, 0.7)",
        "pressed_2": "rgba(0, 158, 83, 0.7)"
          },
          strong: {
            default: "#009e53",
            hover: "#00753e",
            focused: "#00753e",
            enteredSelected: "#009e53",
            pressed: "#00753e",
            disabled: "#46c691"
          }
        },
        neutralInversed: {
          normal: {
            enteredSelected: "#525252",
            hover: "#f5f5f5",
            preesed: "#e4e4e4",
            disabled: "#e4e4e4",
            default: "#f5f5f5",
            focused: "#f5f5f5",
        "default_2": "#f5f5f5",
        "disabled_2": "#e4e4e4",
        "preesed_2": "#e4e4e4",
        "enteredSelected_2": "#525252",
        "hover_2": "#f5f5f5",
        "focused_2": "#f5f5f5",
            pressed: "#e4e4e4"
          },
          strong: {
            disabled: "rgba(255, 255, 255, 0.04)",
            preesed: "rgba(255, 255, 255, 0.08)",
            enteredSelected: "rgba(255, 255, 255, 0.12)",
            default: "rgba(255, 255, 255, 0.04)",
            focused: "rgba(255, 255, 255, 0.08)",
            hover: "rgba(255, 255, 255, 0.08)",
        "disabled_2": "rgba(255, 255, 255, 0.04)",
        "enteredSelected_2": "rgba(255, 255, 255, 0.12)",
        "focused_2": "rgba(255, 255, 255, 0.08)",
        "hover_2": "rgba(255, 255, 255, 0.08)",
        "default_2": "rgba(255, 255, 255, 0.04)",
        "preesed_2": "rgba(255, 255, 255, 0.08)",
            pressed: "rgba(255, 255, 255, 0.08)"
          }
        },
        accent: {
          kakao: "#fee500",
          foundItem: "#eaf2fe",
          lostItem: "#fef4e6",
      "foundItem_2": "#eaf2fe",
      "lostItem_2": "#fef4e6",
      "kakao_2": "#fee500",
      "lostItem2": "#ffefad"
        }
      },
      fg: {
        layout: {
          body: {
            default: "#787878",
        "default_2": "#787878"
          },
          header: {
            default: "#363636",
        "default_2": "#363636"
          }
        },
        neutralInversed: {
          normal: {
            disabled: "#cfcfcf",
            pressed: "#9d9d9d",
            hover: "#000000",
            default: "#5d5d5d",
            focused: "#000000",
            enteredSelected: "#ffffff",
        "pressed_2": "#9d9d9d",
        "disabled_2": "#cfcfcf",
        "enteredSelected_2": "#ffffff",
        "default_2": "#5d5d5d",
        "focused_2": "#000000",
        "hover_2": "#000000"
          },
          strong: {
            default: "#cfcfcf",
            disabled: "#9d9d9d",
            pressed: "#d9d9d9",
            enteredSelected: "#ffffff",
            focused: "#d9d9d9",
            hover: "#d9d9d9",
        "default_2": "#f5f5f5"
          }
        },
        neutral: {
          normal: {
            placeholder: "#787878",
            focused: "#000000",
            hover: "#000000",
            disabled: "#9d9d9d",
            default: "#5d5d5d",
            preesed: "#9d9d9d",
            enteredSelected: "#000000",
        "placeholder_2": "#9d9d9d",
        "focused_2": "#000000",
        "default_2": "#5d5d5d",
        "preesed_2": "#9d9d9d",
        "disabled_2": "#9d9d9d",
        "hover_2": "#000000",
        "enteredSelected_2": "#000000",
            pressed: "#9d9d9d"
          },
          strong: {
            preesed: "#9d9d9d",
            enteredSelected: "#000000",
            default: "#5d5d5d",
            placeholder: "#787878",
            disabled: "#9d9d9d",
            focused: "#000000",
            hover: "#000000",
        "preesed_2": "#9d9d9d",
        "hover_2": "#000000",
        "default_2": "#5d5d5d",
        "enteredSelected_2": "#000000",
        "disabled_2": "#9d9d9d",
        "focused_2": "#000000",
        "placeholder_2": "#9d9d9d",
            pressed: "#9d9d9d"
          }
        },
        brand: {
          subtle: {
            pressed: "#98e3bd",
            enteredSelected: "#f6fffc",
            default: "#f6fffc",
            focused: "#f6fffc",
            hover: "#f6fffc",
            disabled: "#c2f1d4",
        "disabled_2": "#98e3bd",
        "pressed_2": "#6ed5a7",
        "enteredSelected_2": "#0aa874",
        "focused_2": "#00b76e",
        "hover_2": "#00b76e",
        "default_2": "#0aa874"
          },
          normal: {
            disabled: "#98e3bd",
            enteredSelected: "#0aa874",
            focused: "#00b76e",
            hover: "#00b76e",
            default: "#0aa874",
            pressed: "#6ed5a7",
        "default_2": "#f6fffc",
        "disabled_2": "#c2f1d4",
        "pressed_2": "#98e3bd",
        "focused_2": "#f6fffc",
        "hover_2": "#f6fffc",
        "enteredSelected_2": "#f6fffc"
          },
          strongUseThis: {
            default: "#009e53",
            hover: "#00753e",
            focused: "#00753e",
            enteredSelected: "#00b76e",
            pressed: "#009e53",
            disabled: "#0aa874"
          },
          strong: {
            default: "#009e53",
            hover: "#00753e",
            focused: "#00753e",
            enteredSelected: "#009e53",
            pressed: "#00753e",
            disabled: "#0aa874"
          }
        },
        accent: {
          lostItem: "#ff9200",
          foundItem: "#4f95ff",
      "lostItem_2": "#ff9200",
      "foundItem_2": "#4f95ff"
        }
      },
      border: {
        neutral: {
          normal: {
            focused: "#adadad",
            enteredSelected: "#9d9d9d",
            hover: "#adadad",
            pressed: "#cfcfcf",
            disabled: "#cfcfcf",
            default: "#cfcfcf",
        "pressed_2": "#cfcfcf",
        "focused_2": "#adadad",
        "hover_2": "#adadad",
        "default_2": "#cfcfcf",
        "enteredSelected_2": "#9d9d9d",
        "disabled_2": "#cfcfcf"
          },
          strong: {
        "enteredSelected_2": "#69a5ff",
        "focused_2": "#69a5ff",
        "hover_2": "#b8d4ff",
        "default_2": "#cfcfcf",
        "pressed_2": "#b8d4ff",
        "disabled_2": "#cfcfcf",
            enteredSelected: "#69a5ff",
            focused: "#69a5ff",
            hover: "#b8d4ff",
            default: "#cfcfcf",
            pressed: "#b8d4ff",
            disabled: "#cfcfcf"
          }
        },
        divider: {
          default: "#d9d9d9",
      "default_2": "#d9d9d9",
      "default_3": "#e4e4e4"
        },
        brand: {
          subtle: {
        "enteredSelected_2": "#69a5ff",
        "focused_2": "#b8d4ff",
        "default_2": "#cde1fe",
        "pressed_2": "#69a5ff",
        "disabled_2": "#cde1fe",
        "hover_2": "#b8d4ff",
            default: "#d6f8e1",
            hover: "#c2f1d4",
            focused: "#c2f1d4",
            enteredSelected: "#e3fcee",
            pressed: "#c2f1d4",
            disabled: "#e3fcee"
          },
          normal: {
            default: "rgba(30, 184, 123, 0.7)",
            hover: "rgba(0, 183, 110, 0.7)",
            focused: "rgba(0, 183, 110, 0.7)",
            enteredSelected: "rgba(70, 198, 145, 0.7)",
            pressed: "rgba(0, 158, 83, 0.7)",
            disabled: "rgba(152, 227, 189, 0.9)",
        "default_2": "rgba(30, 184, 123, 0.7)",
        "hover_2": "rgba(0, 183, 110, 0.7)",
        "focused_2": "rgba(0, 183, 110, 0.7)",
        "enteredSelected_2": "rgba(70, 198, 145, 0.7)",
        "pressed_2": "rgba(0, 158, 83, 0.7)",
        "disabled_2": "rgba(152, 227, 189, 0.9)"
          }
        }
      },
      system: {
        success: "#00b76e",
        warning: "#ff4242",
        toastSuccess: "#6ed5a7",
        toastWarning: "#ffc642",
    "toastSuccess_3": "#46c691",
    "toastWarning_3": "#ffc642",
    "warning_3": "#ff4242",
    "success_3": "#00b76e",
        bookmark: "#ffc642",
        favorite: "#ff6363",
        unselected: "#adadad",
        announcement: "#ff9200",
        report: "#ff6363"
      },
      bg: {
    "layout_1depth": "#ffffff",
        toast: "rgba(93, 93, 93, 0.7)",
    "layout_2depth": "#f5f5f5",
        dimTransparent: "rgba(0, 0, 0, 0.5)",
        dimOpaque: "#363636",
    "layout_1depth_2": "#ffffff",
    "toast_2": "rgba(93, 93, 93, 0.7)",
    "dimOpaque_2": "#363636",
    "layout_2depth_2": "#f5f5f5",
    "dimTransparent_2": "rgba(120, 120, 120, 0.1)",
    "dimTransparent_3": "rgba(120, 120, 120, 0.1)",
        layoutBrand: "#eefff6",
        notificationBlue: "#4f95ff",
        notificationGrey: "#5d5d5d",
        notificationYellow: "#ffc642",
        notificationBrand: "#0aa874"
      },
      spacing: {
        padding: {
      "padding_400": 16,
      "padding_300": 12,
      "padding_200": 8,
      "padding_250": 10,
      "padding_350": 14,
      "padding_650": 26,
      "padding_150": 6,
      "padding_2000": 80,
      "padding_450": 18,
      "padding_100": 4,
      "padding_1000": 40,
      "padding_900": 36,
      "padding_800": 32,
      "padding_1600": 64,
      "padding_500": 20,
      "padding_1200": 48,
      "padding_750": 30,
      "padding_700": 28,
      "padding_600": 24,
      "padding_50": 2
        },
        gap: {
      "gap_6000": 240,
      "gap_4000": 160,
      "gap_2400": 96,
      "gap_1000": 40,
      "gap_2500": 100,
      "gap_800": 32,
      "gap_450": 18,
      "gap_350": 14,
      "gap_700": 28,
      "gap_400": 16,
      "gap_150": 6,
      "gap_900": 36,
      "gap_600": 24,
      "gap_1200": 48,
      "gap_8000": 320,
      "gap_1600": 64,
      "gap_500": 20,
      "gap_2000": 80,
      "gap_200": 8,
      "gap_50": 2,
      "gap_100": 4,
      "gap_3000": 120,
      "gap_300": 12
        }
      },
      fontSize: {
    "fontsize_900": 36,
    "fontsize_500": 20,
    "fontsize_600": 24,
    "fontsize_450": 18,
    "fontsize_400": 16,
    "fontsize_1000": 40,
    "fontsize_300": 12,
    "fontsize_700": 28,
    "fontsize_350": 14,
    "fontsize_250": 10,
    "fontsize_1400": 56,
    "fontsize_800": 32
      },
      radius: {
    "radius_600": 24,
    "radius_400": 16,
    "radius_2500": 100,
    "radius_250": 10,
    "radius_100": 4
      }
    },
  },
}