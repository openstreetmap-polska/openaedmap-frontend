module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
  ],
  rules: {
    'max-len': ['error', { code: 120 }],
    "indent": ["error", 4],
    "@typescript-eslint/indent": ["error", 4],
    "react/jsx-indent": ["error", 4],
    "react/jsx-indent-props": ["error", 4],
    "@typescript-eslint/quotes": ["error", "double"],
    'no-console': 'off',
    'react/jsx-filename-extension': 'off',
    'eol-last': 'off',
  },
};
