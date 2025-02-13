import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { resolve } from 'node:path';
import type { DotLottieWebworkerComponentInputType } from '../../../../../web/src/lib/@types/dotlottie-web';
import { DotLottieWebWorkerComponent } from './dotlottie-webworker.component';

describe.skip('DotLottieWebworkerComponent', () => {
  const rootDir = resolve(__dirname, '../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');
  const src = resolve(fixturesDir, 'lottie.json');
  const workerId = 'test';

  function createComponent(
    options: Partial<DotLottieWebworkerComponentInputType> = {},
  ): ComponentFixture<DotLottieWebWorkerComponent> {
    const fixture = TestBed.createComponent(DotLottieWebWorkerComponent);
    const component = fixture.componentRef;

    Object.entries(options).forEach(([key, value]) =>
      component.setInput(key, value),
    );

    fixture.detectChanges();

    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotLottieWebWorkerComponent],
    }).compileComponents();
  });

  it('should create component with workerId input', () => {
    const { componentInstance } = createComponent({ src, workerId });

    expect(componentInstance).toBeTruthy();
    expect(componentInstance.workerId()).toBe(workerId);
  });
});
