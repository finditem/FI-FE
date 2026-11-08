const HANGUL_PATTERN = /[가-힣]/;

const DEV_ONLY_CALLEES = new Set([
  "console.log",
  "console.warn",
  "console.error",
  "console.info",
  "console.debug",
  "Sentry.captureException",
  "Sentry.captureMessage",
]);

function calleeSourceText(sourceCode, callee) {
  if (callee.type === "MemberExpression" && !callee.computed) {
    return `${calleeSourceText(sourceCode, callee.object)}.${callee.property.name}`;
  }
  if (callee.type === "Identifier") {
    return callee.name;
  }
  return null;
}

function isInsideDevOnlyCall(sourceCode, node) {
  let current = node.parent;
  while (current) {
    if (current.type === "NewExpression" && current.callee.type === "Identifier") {
      if (/Error$/.test(current.callee.name)) return true;
    }
    if (current.type === "CallExpression") {
      const name = calleeSourceText(sourceCode, current.callee);
      if (name && DEV_ONLY_CALLEES.has(name)) return true;
    }
    // 화살표 함수/일반 함수 경계를 넘으면 더 이상 같은 호출 인자 컨텍스트가 아님
    if (
      current.type === "FunctionExpression" ||
      current.type === "ArrowFunctionExpression" ||
      current.type === "FunctionDeclaration"
    ) {
      return false;
    }
    current = current.parent;
  }
  return false;
}

// as/satisfies/non-null/instantiation은 런타임 값을 감싸는 TS 표현식일 뿐 타입 위치가 아니므로 제외한다.
const RUNTIME_VALUE_WRAPPER_TYPES = new Set([
  "TSAsExpression",
  "TSSatisfiesExpression",
  "TSNonNullExpression",
  "TSInstantiationExpression",
]);

function isTypeContext(node) {
  let current = node.parent;
  while (current) {
    if (current.type.startsWith("TS") && !RUNTIME_VALUE_WRAPPER_TYPES.has(current.type)) return true;
    current = current.parent;
  }
  return false;
}

function isModuleSpecifier(node) {
  const parent = node.parent;
  return (
    parent &&
    (parent.type === "ImportDeclaration" ||
      parent.type === "ExportNamedDeclaration" ||
      parent.type === "ExportAllDeclaration") &&
    parent.source === node
  );
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "번역 함수(useTranslations 등)를 거치지 않고 코드에 직접 작성된 한글 문자열을 감지합니다.",
    },
    schema: [],
    messages: {
      koreanLiteral:
        "한글 리터럴이 감지되었습니다: \"{{text}}\". useTranslations()로 가져온 t() 함수와 src/messages의 번역 키를 통해 문구를 관리해주세요.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    function checkText(node, text) {
      if (!HANGUL_PATTERN.test(text)) return;
      if (isModuleSpecifier(node)) return;
      if (isTypeContext(node)) return;
      if (isInsideDevOnlyCall(sourceCode, node)) return;

      context.report({
        node,
        messageId: "koreanLiteral",
        data: { text: text.trim().slice(0, 40) },
      });
    }

    return {
      JSXText(node) {
        checkText(node, node.value);
      },
      Literal(node) {
        if (typeof node.value !== "string") return;
        checkText(node, node.value);
      },
      TemplateElement(node) {
        checkText(node, node.value.cooked ?? node.value.raw);
      },
    };
  },
};
