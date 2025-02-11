import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { DotlottieWebCanvasComponent } from './dotlottie-web-canvas.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotlottieWebCanvasComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DotlottieWebCanvasComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'ngx-dotlottie-demo' title", () => {
    const fixture = TestBed.createComponent(DotlottieWebCanvasComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ngx-dotlottie-demo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DotlottieWebCanvasComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, ngx-dotlottie-demo',
    );
  });
});
