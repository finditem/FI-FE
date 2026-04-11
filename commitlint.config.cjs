module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "hotfix", "refactor", "test", "chore", "rename", "asset", "design"],
    ],
    "scope-empty": [2, "never"],
    "subject-case": [0],
  },
};
