import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import eslintPluginCypress from 'eslint-plugin-cypress'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      cypress: eslintPluginCypress,
      'unused-imports': eslintPluginUnusedImports,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      // ✅ Disable both to avoid double reporting
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Use only unused-imports
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Formatting
      quotes: ['error', 'single'],
      semi: ['error', 'never'],

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['cypress/**/*.{ts,tsx}', '**/*.cy.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        Cypress: 'readonly',
        cy: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        JQuery: 'readonly',
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        VoidFunction: 'readonly',
        Subject: 'readonly',
        document: 'readonly',
        getComputedStyle: 'readonly',
      },
    },
  },
  prettier,
]
