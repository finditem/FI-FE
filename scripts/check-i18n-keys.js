const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "src/messages");
const LOCALES = ["ko", "en"];

// 로케일마다 표현 방식이 달라 의도적으로 키가 대칭이지 않은 항목.
// key: "네임스페이스.키", value: 해당 키가 없어도 되는 로케일 목록.
const ALLOWED_MISMATCHES = {
  // 한국어는 고정 라벨 + 별도 카운트 포맷, 영어는 ICU plural로 처리 (PostDetailBody.tsx의 isKo 분기 참고)
  "PostDetailBody.favoriteLabel": ["en"],
  "PostDetailBody.favoriteCountLabel": ["ko"],
};

function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).reduce((keys, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return keys.concat(flattenKeys(value, fullKey));
    }
    return keys.concat(fullKey);
  }, []);
}

function loadKeys(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return new Set(flattenKeys(content));
}

function main() {
  const keysByLocale = LOCALES.map((locale) => ({ locale, keys: loadKeys(locale) }));

  let hasMismatch = false;

  for (let i = 0; i < keysByLocale.length; i += 1) {
    for (let j = 0; j < keysByLocale.length; j += 1) {
      if (i === j) continue;

      const base = keysByLocale[i];
      const other = keysByLocale[j];
      const missing = [...base.keys].filter((key) => {
        if (other.keys.has(key)) return false;
        const allowedLocales = ALLOWED_MISMATCHES[key];
        return !allowedLocales || !allowedLocales.includes(other.locale);
      });

      if (missing.length > 0) {
        hasMismatch = true;
        console.log(
          `\n${other.locale}.json에 없는 키 (${base.locale}.json 기준, ${missing.length}개):`
        );
        missing.forEach((key) => console.log(`  - ${key}`));
      }
    }
  }

  if (hasMismatch) {
    console.log("\ni18n 키 불일치가 발견되었습니다.");
    process.exit(1);
  }

  console.log(`i18n 키 일치 확인 완료 (${LOCALES.join(", ")}).`);
}

main();
