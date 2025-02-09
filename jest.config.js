const { resolve } = require('node:path');

/** @type {import('jest').Config} */
module.exports = {
  rootDir: resolve(__dirname),
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: resolve(__dirname, './coverage'),
  coveragePathIgnorePatterns: [
    '.module.ts',
    'main.ts',
    '.mock.ts',
    '.e2e.spec.ts',
  ],
  setupFiles: [],
  setupFilesAfterEnv: [],
  detectOpenHandles: true,
  globals: {
    fetch,
  },
};
