import { TestEnvironment } from 'jest-environment-jsdom';

class MockObserver<T> implements IntersectionObserver, ResizeObserver {
  constructor(_callback: T, _options?: IntersectionObserverInit) {}

  root!: Document | Element | null;
  rootMargin!: string;
  thresholds!: readonly number[];
  observe = (...args: unknown[]): unknown => args;
  unobserve = (...args: unknown[]): unknown => args;
  disconnect = (...args: unknown[]): unknown => args;
  takeRecords = (): IntersectionObserverEntry[] => [];
}

class MockOffscreenCanvas implements OffscreenCanvas {
  constructor(
    readonly width: number,
    readonly height: number,
  ) {}

  oncontextlost = (...args: unknown[]): unknown => args;
  oncontextrestored = (...args: unknown[]): unknown => args;
  transferToImageBitmap = (): ImageBitmap => new globalThis.ImageBitmap();
  addEventListener = (...args: unknown[]): unknown => args;
  removeEventListener = (...args: unknown[]): unknown => args;
  dispatchEvent = (...args: unknown[]): boolean => !!args;
  getContext = (..._args: unknown[]): null => null;

  convertToBlob(options?: ImageEncodeOptions): Promise<Blob> {
    return Promise.resolve(new globalThis.Blob([], options));
  }
}

export default class WASMEnvironment extends TestEnvironment {
  /**
   * @{RequestInfo} input
   * @param {RequestInit} init
   * @returns {Promise<Response>}
   */
  async fetch(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ): Promise<globalThis.Response> {
    const response = await globalThis.fetch(input, {
      ...init,
      cache: 'default',
    });

    return response;
  }

  override async setup(): Promise<void> {
    await super.setup();

    this.global.Blob = globalThis.Blob;
    this.global.File = globalThis.File;
    this.global.FormData = globalThis.FormData;
    this.global.Headers = globalThis.Headers;
    this.global.Request = globalThis.Request;
    this.global.Response = globalThis.Response;
    this.global.TextEncoder = globalThis.TextEncoder;
    this.global.TextDecoder = globalThis.TextDecoder;
    this.global.XMLHttpRequest = globalThis.XMLHttpRequest;
    this.global.ArrayBuffer = globalThis.ArrayBuffer;
    this.global.Uint8Array = globalThis.Uint8Array;
    this.global.Uint8ClampedArray = globalThis.Uint8ClampedArray;
    this.global.Uint16Array = globalThis.Uint16Array;
    this.global.Uint32Array = globalThis.Uint32Array;
    this.global.Int8Array = globalThis.Int8Array;
    this.global.Int16Array = globalThis.Int16Array;
    this.global.Int32Array = globalThis.Int32Array;
    this.global.Float32Array = globalThis.Float32Array;
    this.global.Float64Array = globalThis.Float64Array;
    this.global.DataView = globalThis.DataView;
    this.global.SharedArrayBuffer = globalThis.SharedArrayBuffer;
    this.global.Atomics = globalThis.Atomics;
    this.global.WebAssembly = globalThis.WebAssembly;

    this.global.URL.createObjectURL = globalThis.URL.createObjectURL.bind(
      this.global.URL,
    );

    this.global.URL.revokeObjectURL = globalThis.URL.revokeObjectURL.bind(
      this.global.URL,
    );

    this.global.HTMLCanvasElement.prototype.transferControlToOffscreen =
      (): MockOffscreenCanvas => new MockOffscreenCanvas(0, 0);

    this.global.IntersectionObserver =
      MockObserver<IntersectionObserverCallback>;
    this.global.ResizeObserver = MockObserver<ResizeObserverCallback>;
    this.global.fetch = this.fetch.bind(this);
  }
}
