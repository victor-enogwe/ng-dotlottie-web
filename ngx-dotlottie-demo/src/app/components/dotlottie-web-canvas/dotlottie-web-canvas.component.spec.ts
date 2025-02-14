import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { DotlottieWebCanvasComponent } from './dotlottie-web-canvas.component';

describe('DotlottieWebCanvasComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: true },
      imports: [DotlottieWebCanvasComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DotlottieWebCanvasComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
