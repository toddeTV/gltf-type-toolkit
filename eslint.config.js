import antfu from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'

export default antfu(
  {
    formatters: {
      markdown: 'prettier',
    },

    jsonc: true,

    stylistic: {
      indent: 2,
      quotes: 'single',
    },

    typescript: true,

    yaml: true,
  },
  {
    files: [
      '**/*.js',
      '**/*.json',
      '**/*.md',
      '**/*.ts',
      '**/*.xml',
      '**/*.yaml',
      '**/*.yml',
    ],

    ignores: [
    ],

    plugins: {
      perfectionist,
    },

    rules: {
      'antfu/consistent-chaining': [
        'off',
      ],
      'import/extensions': [ // ensure consistent file extensions in import declarations
        'error',
        'always',
        {
          gltf: 'always',
          js: 'always',
          ts: 'never',
          vue: 'always',
        },
      ],
      'jsonc/sort-keys': [
        'error',
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  },
)
