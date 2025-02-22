import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

// import { FlatCompat } from "@eslint/eslintrc";
// const compat = new FlatCompat({
//   baseDirectory: import.meta.dirname,
//   recommendedConfig: pluginJs.configs.recommended,
//   allConfig: pluginJs.configs.all,
//   tseslint: tseslint.configs.recommended,
// });

const eslintConfig = [
  // ...compat.config({
  //   extends: ["plugin:@limegrass/import-alias/recommended", "prettier"],
  // }),
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: {},
    rules: {},
    plugins: {},
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];

export default eslintConfig;
