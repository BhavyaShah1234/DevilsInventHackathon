import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**/*"]
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...Object.fromEntries(
          Object.entries({
            ...globals.browser,
            ...globals.node,
            React: true,
            process: true,
            __dirname: true,
            require: true,
            global: true
          }).map(([key, value]) => [key.trim(), value])
        )
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "no-undef": "off",
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": ["error"]
    }
  }
];
