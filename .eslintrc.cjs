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
    "indent": "off",
    "@typescript-eslint/indent": ["error", 4],
    "react/jsx-indent": ["error", 4],
    "react/jsx-indent-props": ["error", 4],
    "react/jsx-no-literals": ["error", {
        noStrings: true,
        allowedStrings: [".", ":", "Open", "AED", "Map", "osm.org"],
        ignoreProps: true,
        noAttributeStrings: false
    }],
    "react/require-default-props": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    'no-console': 'off',
    'react/function-component-definition': 'off',
    'eol-last': 'off',
  },
    settings: {
  'import/resolver': {
     alias: {
       map: [['~', './src/']],
       extensions: ['.ts', '.js', '.tsx'],
     },
   },
},
};
