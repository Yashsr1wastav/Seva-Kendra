import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "coverage/**", "PERMISSION_APPLICATION_GUIDE.js"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-case-declarations": "off",
      "no-useless-catch": "off",
      "no-prototype-builtins": "off",
      "no-useless-escape": "off",
    },
  },
];
