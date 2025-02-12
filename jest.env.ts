import { TestEnvironment } from 'jest-environment-jsdom';
// console.log(globalThis.Response)

export default class WASMEnvironment extends TestEnvironment {
  /**
   * @param {RequestInfo} input
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
    this.global.fetch = this.fetch.bind(this);
  }
}
