import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      '**/dist/',
      'build/',
      'coverage/',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',

      'no-var': 'error',
      'no-console': 'warn',
    },
  },
  eslintConfigPrettier
];
