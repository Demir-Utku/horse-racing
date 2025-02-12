import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import oxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**']
  },

  pluginVue.configs['flat/strongly-recommended'],

  vueTsConfigs.recommendedTypeChecked,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}']
  },

  oxlint.configs['flat/recommended'],

  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports'
        }
      ],
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false
          }
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^ignored'
        }
      ],
      '@typescript-eslint/require-await': 'off',
      'complexity': ['error', 15],
      'eqeqeq': ['error', 'smart'],
      'no-alert': 'error',
      'no-return-assign': 'error',
      'no-use-before-define': ['error', { classes: false, functions: false }],
      'no-useless-escape': 'error',
      'no-warning-comments': 'off',
      'func-call-spacing': 'off',

      'vue/array-bracket-spacing': ['error', 'never'],
      'vue/arrow-spacing': ['error', { after: true, before: true }],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'vue/block-spacing': ['error', 'always'],
      'vue/block-tag-newline': [
        'error',
        {
          multiline: 'always',
          singleline: 'always'
        }
      ],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
        }
      ],
      'vue/eqeqeq': ['error', 'smart'],
      'vue/max-attributes-per-line': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/define-emits-declaration': ['error', 'type-based']
    }
  },

  skipFormatting
)
