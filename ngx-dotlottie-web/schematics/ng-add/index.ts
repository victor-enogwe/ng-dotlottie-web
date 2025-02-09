import { Rule } from '@angular-devkit/schematics';
import { addRootImport } from '@schematics/angular/utility';
import { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return addRootImport(
    options.project!,
    ({ code, external }) =>
      code`${external('provideDotLottieWebSSROptions', 'ngx-dotlottie-web')}`,
  );
}
