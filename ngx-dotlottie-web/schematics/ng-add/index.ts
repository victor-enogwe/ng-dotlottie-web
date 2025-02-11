import type { Rule } from '@angular-devkit/schematics';
import { addRootImport } from '@schematics/angular/utility';
import type { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return addRootImport(
    options.project!,
    ({ code, external }) =>
      code`${external('provideDotLottieWebSSROptions', 'ngx-dotlottie-web')}`,
  );
}
