import eslint from '@eslint/js';
import someOtherConfig from './.prettierc';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  someOtherConfig,
  prettierConfig,
);