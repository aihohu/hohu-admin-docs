import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  globalIgnores(['docs/.vitepress/cache', 'docs/.vitepress/dist']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{mts,ts,js,mjs,vue}'],
    rules: {
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly'
      }
    }
  }
);
