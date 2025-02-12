const { resolve } = require('node:path');
const ngPreset = require('jest-preset-angular/presets');

const esmPreset = ngPreset.createCjsPreset();

/** @type {import('jest').Config} */
module.exports = {
  ...esmPreset,
  testEnvironment: resolve(__dirname, 'jest.env.js'),
  rootDir: resolve(__dirname, 'ngx-dotlottie-web'),
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
  testEnvironmentOptions: { pretendToBeVisual: true },
};
