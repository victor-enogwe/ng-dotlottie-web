import { TestEnvironment } from 'jest-environment-jsdom';
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';
// import { Response } from 'node-fetch';
// console.log(globalThis.Response)

class TestResourceLoader extends ResourceLoader {
  fetch(url, options) {
    // console.log('called fetechhhhh');

    return super.fetch(url, options);
  }
}

export default class WASMEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(
      {
        ...config,
        projectConfig: {
          ...config.projectConfig,
          testEnvironmentOptions: {
            ...config.projectConfig.testEnvironmentOptions,
            pretendToBeVisual: true,
            resources: new TestResourceLoader({
              userAgent: 'ngx-dotlottie-web',
            }),
          },
        },
      },
      context,
      { JSDOM, ResourceLoader: TestResourceLoader, VirtualConsole },
    );
  }

  async setup() {
    await super.setup();

    this.global.Blob = globalThis.Blob;
    // this.global.fetch = fetch;
    this.global.File = globalThis.File;
    this.global.FormData = globalThis.FormData;
    // this.global.Headers = Headers;
    // this.global.Request = Request;
    // this.global.Response = Response;
    this.global.TextEncoder = globalThis.TextEncoder;
    this.global.TextDecoder = globalThis.TextDecoder;

    // console.log(this.global.Response instanceof Response, 'heeeeee');
  }
}
