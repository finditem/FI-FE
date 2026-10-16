const fontBold = {
  bold: 700,
  semiBold: 600,
  medium: 500,
  regular: 400,
};
const { bold, semiBold, medium, regular } = fontBold;

const customFonts: Record<string, any> = {
  "display-bold": ["40px", { fontWeight: bold, lineHeight: "130%", letterSpacing: "-0.03em" }],
  "display-medium": ["40px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "-0.03em" }],
  "display-regular": [
    "40px",
    { fontWeight: regular, lineHeight: "130%", letterSpacing: "-0.03em" },
  ],

  "title1-bold": ["36px", { fontWeight: bold, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "title1-medium": ["36px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "title1-regular": ["36px", { fontWeight: regular, lineHeight: "130%", letterSpacing: "-0.02em" }],

  "title2-bold": ["32px", { fontWeight: bold, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "title2-medium": ["32px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "title2-regular": ["32px", { fontWeight: regular, lineHeight: "130%", letterSpacing: "-0.02em" }],

  "title3-bold": ["28px", { fontWeight: bold, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "title3-medium": ["28px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "title3-regular": ["28px", { fontWeight: regular, lineHeight: "130%", letterSpacing: "-0.02em" }],

  "h1-bold": ["24px", { fontWeight: bold, lineHeight: "110%", letterSpacing: "-0.05em" }],
  "h1-medium": ["24px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "-0.02em" }],
  "h1-regular": ["24px", { fontWeight: regular, lineHeight: "110%", letterSpacing: "-0.05em" }],

  "h2-bold": ["20px", { fontWeight: bold, lineHeight: "110%", letterSpacing: "-0.05em" }],
  "h2-medium": ["20px", { fontWeight: medium, lineHeight: "140%", letterSpacing: "-0.01em" }],
  "h2-regular": ["20px", { fontWeight: regular, lineHeight: "110%", letterSpacing: "-0.05em" }],

  "h3-semibold": ["18px", { fontWeight: semiBold, lineHeight: "140%" }],
  "h3-medium": ["18px", { fontWeight: medium, lineHeight: "140%" }],
  "h3-regular": ["18px", { fontWeight: regular, lineHeight: "140%" }],

  "body1-semibold": ["16px", { fontWeight: semiBold, lineHeight: "150%" }],
  "body1-medium": ["16px", { fontWeight: medium, lineHeight: "150%" }],
  "body1-regular": ["16px", { fontWeight: regular, lineHeight: "150%" }],

  "body2-semibold": ["14px", { fontWeight: semiBold, lineHeight: "140%" }],
  "body2-medium": ["14px", { fontWeight: medium, lineHeight: "140%" }],
  "body2-regular": ["14px", { fontWeight: regular, lineHeight: "140%" }],

  "caption1-semibold": [
    "12px",
    { fontWeight: semiBold, lineHeight: "130%", letterSpacing: "0.02em" },
  ],
  "caption1-medium": ["12px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "0.02em" }],
  "caption1-regular": [
    "12px",
    { fontWeight: regular, lineHeight: "130%", letterSpacing: "0.02em" },
  ],

  "caption2-semibold": [
    "10px",
    { fontWeight: semiBold, lineHeight: "130%", letterSpacing: "0.03em" },
  ],
  "caption2-medium": ["10px", { fontWeight: medium, lineHeight: "130%", letterSpacing: "0.03em" }],
  "caption2-regular": [
    "10px",
    { fontWeight: regular, lineHeight: "130%", letterSpacing: "0.03em" },
  ],
};

export default customFonts;
