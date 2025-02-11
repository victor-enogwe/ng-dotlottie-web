import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { DotLottieWebSSRService } from './dotlottie-web-ssr.service';

describe('DotLottieWebService', () => {
  let service: DotLottieWebSSRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotLottieWebSSRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
