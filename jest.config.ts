import { type Config } from 'jest';
import presets from 'jest-preset-angular/presets';
import { resolve } from 'node:path';

const tsPreset = presets.createCjsPreset();

const roots: Array<{
  root: string;
  color: Array<Exclude<Config['displayName'], string | undefined>['color']>;
}> = [
  {
    root: resolve(__dirname, 'ngx-dotlottie-web'),
    color: ['greenBright', 'magentaBright'],
  },
  {
    root: resolve(__dirname, 'ngx-dotlottie-demo'),
    color: ['blueBright', 'redBright'],
  },
];

const zones = [
  // resolve(__dirname, 'jest.setup-zone.ts'),
  resolve(__dirname, 'jest.setup-zoneless.ts'),
];

const testPathIgnorePatterns = [
  '<rootDir>/node_modules/',
  '<rootDir>/dist/',
  '<rootDir>/coverage/',
  'coverage.ts',
];

export default {
  testPathIgnorePatterns,
  projects: roots.flatMap(({ root, color }) =>
    zones.map((zone, index) => {
      const name = root.split('/').pop()!;
      const zoneName = zone.split('-').pop()?.replace('.ts', '');

      return {
        ...tsPreset,
        detectOpenHandles: true,
        testMatch: [`${root}/**/*.spec.ts`],
        displayName: { color: color[index], name: `${name}/${zoneName}` },
        collectCoverageFrom: ['**/*.(t|j)s'],
        coverageDirectory: resolve(__dirname, './coverage', name, zoneName!),
        testEnvironment: resolve(__dirname, 'jest.env.ts'),
        setupFiles: ['jsdom-worker', zone],
        testPathIgnorePatterns,
        coveragePathIgnorePatterns: [
          '.module.ts',
          'main.ts',
          '.mock.ts',
          '.e2e.spec.ts',
        ],
      };
    }),
  ),
} satisfies Config;
