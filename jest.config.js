const { resolve } = require('node:path');

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: resolve(__dirname, 'jest.env.js'),
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
  setupFiles: [resolve(__dirname, './jest.setup.js')],
  setupFilesAfterEnv: [],
  detectOpenHandles: true,
};
