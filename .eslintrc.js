module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules', '*generated.ts'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    indent: 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': [
      'error',
      {
        ignoreIIFE: true,
      },
    ],
    'react/prop-types': 'off',
    'object-curly-spacing': ['error', 'always'],
    curly: ['error', 'multi-or-nest'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
