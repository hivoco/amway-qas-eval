import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

/** Inline plugin: error when a file exceeds a hard line limit */
const maxLinesHardPlugin = {
  meta: { name: "max-lines-hard" },
  rules: {
    limit: {
      meta: {
        type: "suggestion",
        schema: [{ type: "object", properties: { max: { type: "number" } } }],
      },
      create(context) {
        const max = context.options[0]?.max ?? 350;
        return {
          "Program:exit"(node) {
            const lineCount = context.sourceCode.lines.length;
            if (lineCount > max) {
              context.report({
                node,
                message: `File has too many lines (${lineCount}). Hard limit is ${max}.`,
              });
            }
          },
        };
      },
    },
  },
};

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      "max-lines-hard": maxLinesHardPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Warn when a file exceeds 250 lines (soft limit)
      "max-lines": [
        "warn",
        { max: 250, skipBlankLines: true, skipComments: true },
      ],
      // Error when a file exceeds 350 lines (hard limit)
      "max-lines-hard/limit": ["error", { max: 350 }],
    },
  },
  eslintConfigPrettier,
]);
