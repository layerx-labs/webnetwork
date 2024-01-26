const {TestEnvironment} = require("jest-environment-jsdom");

const resizeObserver = require("resize-observer-polyfill");

module.exports = class CustomTestEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util');
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }

    this.global.ResizeObserver = resizeObserver;
  }
}