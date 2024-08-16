import pluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import globals from 'globals';

export default [
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  pluginReact.configs.flat.recommended,
  {rules: {'react/react-in-jsx-scope': 'off'}},
];
