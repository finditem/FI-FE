const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "src/components/common/Icon/icon-manifest.json");
const ASSETS_DIR = path.join(ROOT, "src/assets");
const OUTPUT_PATH = path.join(ROOT, "public/icons/sprite.svg");

// next.config.js의 @svgr/webpack replaceAttrValues 설정과 동일하게 맞춥니다.
const CURRENT_COLOR_VALUES = ["#000", "#000000", "#D9D9D9"];

function toCurrentColor(markup) {
  return CURRENT_COLOR_VALUES.reduce((result, value) => {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`=(?:"${escaped}"|'${escaped}')`, "gi");
    return result.replace(regex, '="currentColor"');
  }, markup);
}

// 여러 SVG를 하나의 문서로 합칠 때 <defs>/<clipPath> 등의 id가 충돌하지 않도록 아이콘별로 네임스페이스를 부여합니다.
function namespaceIds(markup, prefix) {
  const ids = new Set();
  const idRegex = /\bid=(?:"([^"]+)"|'([^']+)')/g;
  let match;
  while ((match = idRegex.exec(markup))) {
    ids.add(match[1] || match[2]);
  }

  return Array.from(ids).reduce((result, id) => {
    const namespaced = `${prefix}-${id}`;
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return result
      .replace(new RegExp(`id=(?:"${escaped}"|'${escaped}')`, "g"), `id="${namespaced}"`)
      .replace(
        new RegExp(`url\\((?:"#${escaped}"|'#${escaped}'|#${escaped})\\)`, "g"),
        `url(#${namespaced})`
      )
      .replace(
        new RegExp(`(xlink:href|href)=(?:"#${escaped}"|'#${escaped}')`, "g"),
        `$1="#${namespaced}"`
      );
  }, markup);
}

function buildSymbol(name, slug) {
  const filePath = path.join(ASSETS_DIR, `${slug}.svg`);
  const raw = fs.readFileSync(filePath, "utf-8");

  const rootMatch = raw.match(/<svg([^>]*)>/);
  if (!rootMatch) {
    throw new Error(`${filePath}에 svg 루트 태그가 없습니다.`);
  }
  const rootAttrs = rootMatch[1];

  const viewBoxMatch = rootAttrs.match(/viewBox=(?:"([^"]+)"|'([^']+)')/);
  if (!viewBoxMatch) {
    throw new Error(`${filePath}에 viewBox가 없습니다.`);
  }
  const viewBox = viewBoxMatch[1] || viewBoxMatch[2];

  // fill="none"처럼 자식 엘리먼트가 상속받는 루트의 presentation 속성은
  // symbol에도 그대로 옮겨야 원본과 동일하게 렌더링됩니다.
  const inheritedAttrs = (rootAttrs.match(/[\w:-]+=(?:"[^"]*"|'[^']*')/g) || [])
    .filter((attr) => !/^(width|height|viewBox|xmlns)/.test(attr))
    .join(" ");

  const innerMatch = raw.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const inner = innerMatch ? innerMatch[1].trim() : "";

  const content = toCurrentColor(namespaceIds(inner, name));
  const attrSuffix = inheritedAttrs ? ` ${inheritedAttrs}` : "";

  return `<symbol id="${name}" viewBox="${viewBox}"${attrSuffix}>${content}</symbol>`;
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const names = Object.keys(manifest);

  const symbols = names.map((name) => buildSymbol(name, manifest[name])).join("\n");
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n${symbols}\n</svg>\n`;

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, sprite, "utf-8");

  console.log(
    `아이콘 스프라이트 생성 완료: ${names.length}개 아이콘 → ${path.relative(ROOT, OUTPUT_PATH)}`
  );
}

main();
