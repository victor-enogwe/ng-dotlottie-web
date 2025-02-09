// @ts-check

/** @type {import('prettier').Config} */
export default {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  overrides: [
    {
      files: ['*.ts', '*.js'],
      options: {
        parser: 'typescript',
      },
    },
    {
      files: ['*.md'],
      options: {
        parser: 'markdown',
      },
    },
    {
      files: ['**/*.json', '**/*.*css', '**/*.html'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['**/*.json'],
      options: {
        parser: 'json',
        trailingComma: 'none',
      },
    },
    {
      files: ['**/*.html'],
      options: {
        parser: 'html',
        htmlWhitespaceSensitivity: 'strict',
      },
    },
    {
      files: ['**/*.component.html'],
      options: {
        parser: 'angular',
      },
    },
  ],
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  singleAttributePerLine: true,
};
