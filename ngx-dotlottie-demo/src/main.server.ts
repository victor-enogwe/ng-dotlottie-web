import type { ApplicationRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { AppComponent } from './app/components/app/app.component';

const bootstrap = (): Promise<ApplicationRef> =>
  bootstrapApplication(AppComponent, config);

export default bootstrap;
