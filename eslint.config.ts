import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tsParser from '@typescript-eslint/parser'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },
  },

  globalIgnores(['eslint.config.ts', '**/dist/**', '**/coverage/**', '**/node_modules/**']),

  pluginVue.configs['flat/essential'], // includes basic Vue support
  vueTsConfigs.recommended, // TypeScript rules
  skipFormatting, // disables Prettier formatting rules
)
