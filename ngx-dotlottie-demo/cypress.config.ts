import { defineConfig } from 'cypress';
import { resolve } from 'node:path';

const commonOptions: Cypress.ConfigOptions['e2e'] = {
  supportFolder: resolve(__dirname, 'cypress/support'),
  supportFile: resolve(__dirname, 'cypress/support/e2e.ts'),
  fixturesFolder: resolve(__dirname, 'cypress/fixtures'),
  videosFolder: resolve(__dirname, 'cypress/videos'),
  screenshotsFolder: resolve(__dirname, 'cypress/screenshots'),
  downloadsFolder: resolve(__dirname, 'cypress/downloads'),
  specPattern: resolve(__dirname, 'cypress/**/*.cy.ts'),
};

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    ...commonOptions,
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    ...commonOptions,
  },
});
