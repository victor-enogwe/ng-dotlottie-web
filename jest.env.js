import { TestEnvironment } from 'jest-environment-jsdom';
// console.log(globalThis.Response)

export default class WASMEnvironment extends TestEnvironment {
  /**
   * @param {RequestInfo} input
   * @param {RequestInit} init
   * @returns {Promise<Response>}
   */
  async fetch(input, init) {
    const response = await globalThis.fetch(input, {
      ...init,
      cache: 'default',
    });

    return response;
  }

  async setup() {
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
    this.global.fetch = this.fetch;
  }
}
