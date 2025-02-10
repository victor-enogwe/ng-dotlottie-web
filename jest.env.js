import { TestEnvironment } from 'jest-environment-jsdom';

export default class WASMEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    this.global.Blob = globalThis.Blob;
    this.global.fetch = globalThis.fetch;
    this.global.File = globalThis.File;
    this.global.FormData = globalThis.FormData;
    this.global.Headers = globalThis.Headers;
    this.global.Request = globalThis.Request;
    this.global.Response = globalThis.Response;
    this.global.TextEncoder = globalThis.TextEncoder;
    this.global.TextDecoder = globalThis.TextDecoder;
  }
}
