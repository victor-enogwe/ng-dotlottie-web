import { getTestBed } from '@angular/core/testing';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

getTestBed().resetTestEnvironment();

setupZoneTestEnv({
  teardown: { destroyAfterEach: true, rethrowErrors: true },
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
